package com.app.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/** Request DTO: a doctor prescribes medicines to a patient. */
public class PrescriptionDTO {

    @NotNull(message = "Doctor id is required")
    private Long doctorId;

    @NotNull(message = "Patient id is required")
    private Long patientId;

    private String notes;

    @Valid
    @NotEmpty(message = "At least one medicine must be prescribed")
    private List<Item> items;

    public static class Item {
        @NotNull(message = "Medicine id is required")
        private Long medicineId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotBlank(message = "Dosage instructions are required")
        private String dosage;

        private Integer durationDays;

        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }
        public Integer getDurationDays() { return durationDays; }
        public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}

