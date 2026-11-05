package com.app.entity.modal;

import java.time.LocalDate;
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

/**
 * Entity representing a Doctor's Prescription linked to a Patient.
 */
@Entity
@Table(name = "prescriptions")
public class Prescription extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "appointement"})
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "appointement"})
    private Patient patient;

    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate;

    @Column(name = "notes", length = 500)
    private String notes;

    /** Status: PENDING, DISPENSED */
    @Column(name = "status", length = 20)
    private String status = "PENDING";

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionItem> items = new ArrayList<>();

    // ─── Constructors ────────────────────────────────────────────────────────

    public Prescription() {}

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Doctor  getDoctor()                           { return doctor; }
    public void    setDoctor(Doctor doctor)              { this.doctor = doctor; }

    public Patient getPatient()                          { return patient; }
    public void    setPatient(Patient patient)           { this.patient = patient; }

    public LocalDate getPrescriptionDate()                           { return prescriptionDate; }
    public void      setPrescriptionDate(LocalDate prescriptionDate) { this.prescriptionDate = prescriptionDate; }

    public String getNotes()                             { return notes; }
    public void   setNotes(String notes)                 { this.notes = notes; }

    public String getStatus()                            { return status; }
    public void   setStatus(String status)               { this.status = status; }

    public List<PrescriptionItem> getItems()             { return items; }
    public void setItems(List<PrescriptionItem> items)   { this.items = items; }

    public void addItem(PrescriptionItem item) {
        items.add(item);
        item.setPrescription(this);
    }
}

