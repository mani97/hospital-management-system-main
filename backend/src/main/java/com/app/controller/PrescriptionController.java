package com.app.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.PrescriptionDTO;
import com.app.entity.modal.Prescription;
import com.app.service.intf.PrescriptionServiceIntf;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionServiceIntf prescriptionService;

    /** GET /api/prescriptions?status=PENDING  or  ?patientId=3 */
    @GetMapping
    public List<Prescription> getAll(@RequestParam(required = false) String status,
            @RequestParam(required = false) Long patientId) {
        return prescriptionService.getAll(status, patientId);
    }

    @GetMapping("/{id}")
    public Prescription getById(@PathVariable Long id) {
        return prescriptionService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Prescription> create(@RequestBody @Valid PrescriptionDTO dto) {
        return new ResponseEntity<>(prescriptionService.create(dto), HttpStatus.CREATED);
    }
}

