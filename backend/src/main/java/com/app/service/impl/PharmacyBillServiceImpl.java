package com.app.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.custome_exception.PharmacyBusinessException;
import com.app.custome_exception.ResourceNotFoundException;
import com.app.dto.BillRequestDTO;
import com.app.entity.modal.BillItem;
import com.app.entity.modal.Medicine;
import com.app.entity.modal.Patient;
import com.app.entity.modal.PharmacyBill;
import com.app.entity.modal.PharmacyLocation;
import com.app.entity.modal.Prescription;
import com.app.entity.modal.PrescriptionItem;
import com.app.repository.MedicineRepository;
import com.app.repository.PatientRepository;
import com.app.repository.PharmacyBillRepository;
import com.app.repository.PrescriptionRepository;
import com.app.service.intf.PharmacyBillServiceIntf;
import com.app.util.InvoicePdfGenerator;

@Service
@Transactional
public class PharmacyBillServiceImpl implements PharmacyBillServiceIntf {

    @Autowired private PharmacyBillRepository billRepo;
    @Autowired private PatientRepository patientRepo;
    @Autowired private MedicineRepository medicineRepo;
    @Autowired private PrescriptionRepository prescriptionRepo;
    @Autowired private InvoicePdfGenerator pdfGenerator;
    @Autowired private PharmacyNotificationService notifier;
    @Autowired private com.app.service.intf.LocationInventoryServiceIntf inventory;

    /**
     * Builds the bill, validates stock, deducts inventory, computes subtotal,
     * tax and total, and marks the prescription as DISPENSED.
     */
    @Override
    public PharmacyBill generateBill(BillRequestDTO req) {
        Patient patient = patientRepo.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + req.getPatientId()));

        // Resolve line items (medicineId -> qty)
        List<long[]> lines = new ArrayList<>();
        Prescription prescription = null;
        if (req.getPrescriptionId() != null) {
            prescription = prescriptionRepo.findById(req.getPrescriptionId()).orElseThrow(
                    () -> new ResourceNotFoundException("Prescription not found with id " + req.getPrescriptionId()));
            if (!prescription.getPatient().getId().equals(patient.getId())) {
                throw new PharmacyBusinessException("Prescription does not belong to this patient");
            }
            if ("DISPENSED".equals(prescription.getStatus())) {
                throw new PharmacyBusinessException("Prescription has already been dispensed");
            }
            for (PrescriptionItem pi : prescription.getItems()) {
                lines.add(new long[] { pi.getMedicine().getId(), pi.getQuantity() });
            }
        } else if (req.getItems() != null) {
            for (BillRequestDTO.Item i : req.getItems()) {
                lines.add(new long[] { i.getMedicineId(), i.getQuantity() });
            }
        }
        if (lines.isEmpty()) {
            throw new PharmacyBusinessException("Bill must contain at least one medicine");
        }

        PharmacyBill bill = new PharmacyBill();
        PharmacyLocation location = inventory.resolveLocation(req.getLocationId());
        bill.setLocation(location);
        bill.setPatient(patient);
        bill.setPrescription(prescription);
        bill.setPaymentMode(req.getPaymentMode());
        bill.setPaymentStatus("PAID");

        BigDecimal subtotal = BigDecimal.ZERO;
        for (long[] l : lines) {
            Medicine med = medicineRepo.findById(l[0])
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + l[0]));
            int qty = (int) l[1];
            if (med.isExpired()) {
                throw new PharmacyBusinessException(med.getMedicineName() + " is expired and cannot be sold");
            }
            // checks stock at the selling location and deducts it (also updates the total)
            inventory.deduct(location.getId(), med, qty);

            BillItem item = new BillItem(med, qty, med.getPrice());
            bill.addBillItem(item);
            subtotal = subtotal.add(item.getLineTotal());
        }

        BigDecimal taxPct = req.getTaxPercent() == null ? BigDecimal.ZERO : req.getTaxPercent();
        BigDecimal tax = subtotal.multiply(taxPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        bill.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        bill.setTaxPercent(taxPct);
        bill.setTaxAmount(tax);
        bill.setTotalAmount(subtotal.add(tax).setScale(2, RoundingMode.HALF_UP));

        if (prescription != null) {
            prescription.setStatus("DISPENSED");
        }
        PharmacyBill saved = billRepo.saveAndFlush(bill);

        if (req.isEmailBill()) {
            notifier.sendBillEmail(saved);
        }
        if (req.isWhatsappConfirmation()) {
            notifier.sendWhatsAppConfirmation(saved);
        }
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public PharmacyBill getById(Long id) {
        return billRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PharmacyBill> getAll(Long patientId) {
        return patientId == null ? billRepo.findAllByOrderByBillDateDesc()
                : billRepo.findByPatientIdOrderByBillDateDesc(patientId);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(Long billId) {
        return pdfGenerator.generate(getById(billId));
    }

    @Override
    @Transactional(readOnly = true)
    public void emailBill(Long billId) {
        notifier.sendBillEmail(getById(billId));
    }
}

