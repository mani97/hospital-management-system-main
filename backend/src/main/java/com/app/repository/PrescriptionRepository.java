package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.modal.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId);

    List<Prescription> findByStatusOrderByPrescriptionDateDesc(String status);

    List<Prescription> findAllByOrderByPrescriptionDateDesc();
}

