package com.app.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.custome_exception.PharmacyBusinessException;
import com.app.custome_exception.ResourceNotFoundException;
import com.app.dto.MedicineDTO;
import com.app.entity.modal.Medicine;
import com.app.repository.MedicineRepository;
import com.app.service.intf.MedicineServiceIntf;

@Service
@Transactional
public class MedicineServiceImpl implements MedicineServiceIntf {

    @Autowired
    private MedicineRepository medicineRepo;

    @Autowired
    private com.app.service.intf.LocationInventoryServiceIntf inventory;

    @Override
    @Transactional(readOnly = true)
    public List<Medicine> getAll(String search) {
        if (search == null || search.trim().isEmpty()) {
            return medicineRepo.findAll();
        }
        return medicineRepo.search(search.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public Medicine getById(Long id) {
        return medicineRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + id));
    }

    @Override
    public Medicine add(MedicineDTO dto) {
        if (medicineRepo.existsByBatchNumber(dto.getBatchNumber())) {
            throw new PharmacyBusinessException("Batch number already exists: " + dto.getBatchNumber());
        }
        validateExpiry(dto.getExpiryDate());
        Medicine m = new Medicine();
        copy(dto, m);
        m.setQuantity(0);
        m = medicineRepo.save(m);
        // initial stock goes to the chosen location; Medicine.quantity becomes the total
        inventory.setStock(dto.getLocationId(), m, dto.getQuantity());
        return m;
    }

    @Override
    public Medicine update(Long id, MedicineDTO dto) {
        Medicine m = getById(id);
        if (!m.getBatchNumber().equals(dto.getBatchNumber())
                && medicineRepo.existsByBatchNumber(dto.getBatchNumber())) {
            throw new PharmacyBusinessException("Batch number already exists: " + dto.getBatchNumber());
        }
        validateExpiry(dto.getExpiryDate());
        copy(dto, m);
        return medicineRepo.save(m);
    }

    /** Sets the absolute stock quantity at one location (default: Main Pharmacy). */
    @Override
    public Medicine updateStock(Long id, Long locationId, int quantity) {
        if (quantity < 0) {
            throw new PharmacyBusinessException("Stock quantity cannot be negative");
        }
        Medicine m = getById(id);
        inventory.setStock(locationId, m, quantity);
        return m;
    }

    @Override
    public void delete(Long id) {
        Medicine m = getById(id);
        try {
            inventory.removeStockForMedicine(id);
            medicineRepo.delete(m);
            medicineRepo.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new PharmacyBusinessException(
                    "Medicine is referenced by prescriptions/bills and cannot be deleted");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medicine> getLowStock(int threshold) {
        return medicineRepo.findByQuantityLessThanOrderByQuantityAsc(threshold);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medicine> getExpired() {
        return medicineRepo.findByExpiryDateBeforeOrderByExpiryDateAsc(LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medicine> getExpiringWithin(int days) {
        LocalDate today = LocalDate.now();
        return medicineRepo.findByExpiryDateBetweenOrderByExpiryDateAsc(today, today.plusDays(days));
    }

    private void validateExpiry(LocalDate expiry) {
        if (expiry.isBefore(LocalDate.now())) {
            throw new PharmacyBusinessException("Cannot add a medicine that is already expired");
        }
    }

    private void copy(MedicineDTO dto, Medicine m) {
        m.setMedicineName(dto.getMedicineName().trim());
        m.setCategory(dto.getCategory().trim());
        m.setManufacturer(dto.getManufacturer().trim());
        m.setBatchNumber(dto.getBatchNumber().trim());
        m.setExpiryDate(dto.getExpiryDate());
        m.setPrice(dto.getPrice());
    }
}

