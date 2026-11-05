package com.app.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.BillRequestDTO;
import com.app.entity.modal.PharmacyBill;
import com.app.service.intf.PharmacyBillServiceIntf;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PharmacyBillController {

    @Autowired
    private PharmacyBillServiceIntf billService;

    /** POST /api/bills - generate a bill (deducts stock, applies tax). */
    @PostMapping
    public ResponseEntity<PharmacyBill> generate(@RequestBody @Valid BillRequestDTO request) {
        return new ResponseEntity<>(billService.generateBill(request), HttpStatus.CREATED);
    }

    @GetMapping
    public List<PharmacyBill> getAll(@RequestParam(required = false) Long patientId) {
        return billService.getAll(patientId);
    }

    @GetMapping("/{id}")
    public PharmacyBill getById(@PathVariable Long id) {
        return billService.getById(id);
    }

    /** GET /api/bills/{id}/invoice - PDF invoice download. */
    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> invoice(@PathVariable Long id) {
        byte[] pdf = billService.generateInvoicePdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);
    }

    /** POST /api/bills/{id}/email - email the invoice to the patient. */
    @PostMapping("/{id}/email")
    public ResponseEntity<Map<String, String>> email(@PathVariable Long id) {
        billService.emailBill(id);
        return ResponseEntity.ok(Map.of("message", "Invoice email sent"));
    }
}

