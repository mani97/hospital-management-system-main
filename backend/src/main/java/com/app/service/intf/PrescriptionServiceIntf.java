package com.app.service.intf;

import java.util.List;

import com.app.dto.PrescriptionDTO;
import com.app.entity.modal.Prescription;

public interface PrescriptionServiceIntf {
    Prescription create(PrescriptionDTO dto);
    List<Prescription> getAll(String status, Long patientId);
    Prescription getById(Long id);
}

