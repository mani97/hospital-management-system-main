package com.app.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Request DTO to generate a pharmacy bill.
 * Either supply {@code prescriptionId} (items are taken from the prescription)
 * or supply an explicit list of {@code items} for an over-the-counter sale.
 */
public class BillRequestDTO {

    @NotNull(message = "Patient id is required")
    private Long patientId;

    private Long prescriptionId;

    /** Location the stock is sold from (defaults to Main Pharmacy). */
    private Long locationId;

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    @Valid
    private List<Item> items;

    @DecimalMin(value = "0.0", message = "Tax percent cannot be negative")
    @DecimalMax(value = "100.0", message = "Tax percent cannot exceed 100")
    private BigDecimal taxPercent = new BigDecimal("12.0");

    /** CASH, CARD or UPI */
    private String paymentMode = "CASH";

    private boolean emailBill = false;
    private boolean whatsappConfirmation = false;

    public static class Item {
        @NotNull(message = "Medicine id is required")
        private Long medicineId;
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
    public BigDecimal getTaxPercent() { return taxPercent; }
    public void setTaxPercent(BigDecimal taxPercent) { this.taxPercent = taxPercent; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public boolean isEmailBill() { return emailBill; }
    public void setEmailBill(boolean emailBill) { this.emailBill = emailBill; }
    public boolean isWhatsappConfirmation() { return whatsappConfirmation; }
    public void setWhatsappConfirmation(boolean w) { this.whatsappConfirmation = w; }
}

