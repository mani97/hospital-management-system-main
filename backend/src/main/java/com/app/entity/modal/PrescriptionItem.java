package com.app.entity.modal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A single medicine line in a Prescription.
 */
@Entity
@Table(name = "prescription_items")
public class PrescriptionItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonIgnore
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Medicine medicine;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotBlank(message = "Dosage instructions are required")
    @Column(name = "dosage", nullable = false, length = 200)
    private String dosage;

    @Column(name = "duration_days")
    private Integer durationDays;

    // ─── Constructors ────────────────────────────────────────────────────────

    public PrescriptionItem() {}

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Prescription getPrescription()                     { return prescription; }
    public void         setPrescription(Prescription p)       { this.prescription = p; }

    public Medicine getMedicine()                             { return medicine; }
    public void     setMedicine(Medicine medicine)            { this.medicine = medicine; }

    public Integer getQuantity()                              { return quantity; }
    public void    setQuantity(Integer quantity)              { this.quantity = quantity; }

    public String getDosage()                                 { return dosage; }
    public void   setDosage(String dosage)                   { this.dosage = dosage; }

    public Integer getDurationDays()                          { return durationDays; }
    public void    setDurationDays(Integer durationDays)      { this.durationDays = durationDays; }
}

