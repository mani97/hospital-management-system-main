package com.app.entity.modal;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.hibernate.annotations.CreationTimestamp;

/**
 * Entity representing a Pharmacy Bill / Invoice.
 */
@Entity
@Table(name = "pharmacy_bills")
public class PharmacyBill extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password", "appointement" })
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password", "appointement" })
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private PharmacyLocation location;

    public PharmacyLocation getLocation() {
        return location;
    }

    public void setLocation(PharmacyLocation location) {
        this.location = location;
    }

    @Column(name = "subtotal", precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    /** GST / tax percentage, e.g. 18.0 for 18% */
    @Column(name = "tax_percent", precision = 5, scale = 2)
    private BigDecimal taxPercent = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /** PENDING, PAID */
    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "PENDING";

    /** CASH, CARD, UPI */
    @Column(name = "payment_mode", length = 20)
    private String paymentMode;

    @CreationTimestamp
    @Column(name = "bill_date", updatable = false)
    private LocalDateTime billDate;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillItem> billItems = new ArrayList<>();

    // ─── Constructors ────────────────────────────────────────────────────────

    public PharmacyBill() {
    }

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription p) {
        this.prescription = p;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public LocalDateTime getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDateTime billDate) {
        this.billDate = billDate;
    }

    public List<BillItem> getBillItems() {
        return billItems;
    }

    public void setBillItems(List<BillItem> items) {
        this.billItems = items;
    }

    public void addBillItem(BillItem item) {
        billItems.add(item);
        item.setBill(this);
    }
}
