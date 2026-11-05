package com.app.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.custome_exception.ResourceNotFoundException;
import com.app.dto.PrescriptionDTO;
import com.app.entity.modal.Doctor;
import com.app.entity.modal.Medicine;
import com.app.entity.modal.Patient;
import com.app.entity.modal.Prescription;
import com.app.entity.modal.PrescriptionItem;
import com.app.repository.DoctorRepository;
import com.app.repository.MedicineRepository;
import com.app.repository.PatientRepository;
import com.app.repository.PrescriptionRepository;
import com.app.service.intf.PrescriptionServiceIntf;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionServiceIntf {

    @Autowired private PrescriptionRepository prescriptionRepo;
    @Autowired private DoctorRepository doctorRepo;
    @Autowired private PatientRepository patientRepo;
    @Autowired private MedicineRepository medicineRepo;

    @Override
    public Prescription create(PrescriptionDTO dto) {
        Doctor doctor = doctorRepo.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + dto.getDoctorId()));
        Patient patient = patientRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + dto.getPatientId()));

        Prescription p = new Prescription();
        p.setDoctor(doctor);
        p.setPatient(patient);
        p.setNotes(dto.getNotes());
        p.setPrescriptionDate(LocalDate.now());
        p.setStatus("PENDING");

        for (PrescriptionDTO.Item i : dto.getItems()) {
            Medicine med = medicineRepo.findById(i.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + i.getMedicineId()));
            PrescriptionItem item = new PrescriptionItem();
            item.setMedicine(med);
            item.setQuantity(i.getQuantity());
            item.setDosage(i.getDosage());
            item.setDurationDays(i.getDurationDays());
            p.addItem(item);
        }
        return prescriptionRepo.save(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Prescription> getAll(String status, Long patientId) {
        if (patientId != null) {
            return prescriptionRepo.findByPatientIdOrderByPrescriptionDateDesc(patientId);
        }
        if (status != null && !status.isEmpty()) {
            return prescriptionRepo.findByStatusOrderByPrescriptionDateDesc(status.toUpperCase());
        }
        return prescriptionRepo.findAllByOrderByPrescriptionDateDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Prescription getById(Long id) {
        return prescriptionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id " + id));
    }
}

