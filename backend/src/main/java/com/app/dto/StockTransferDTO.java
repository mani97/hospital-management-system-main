package com.app.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/** Request to move stock of a medicine between two locations. */
public class StockTransferDTO {

    @NotNull(message = "Source location is required")
    private Long fromLocationId;

    @NotNull(message = "Destination location is required")
    private Long toLocationId;

    @NotNull(message = "Medicine id is required")
    private Long medicineId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Transfer quantity must be at least 1")
    private Integer quantity;

    public Long getFromLocationId() { return fromLocationId; }
    public void setFromLocationId(Long fromLocationId) { this.fromLocationId = fromLocationId; }
    public Long getToLocationId() { return toLocationId; }
    public void setToLocationId(Long toLocationId) { this.toLocationId = toLocationId; }
    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

