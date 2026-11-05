package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.modal.PharmacyBill;

public interface PharmacyBillRepository extends JpaRepository<PharmacyBill, Long> {

    List<PharmacyBill> findByPatientIdOrderByBillDateDesc(Long patientId);

    List<PharmacyBill> findAllByOrderByBillDateDesc();
}

