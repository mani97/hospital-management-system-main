package com.app.service.intf;

import java.util.List;

import com.app.dto.BillRequestDTO;
import com.app.entity.modal.PharmacyBill;

public interface PharmacyBillServiceIntf {
    PharmacyBill generateBill(BillRequestDTO request);
    PharmacyBill getById(Long id);
    List<PharmacyBill> getAll(Long patientId);
    byte[] generateInvoicePdf(Long billId);
    void emailBill(Long billId);
}

