package com.app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * DTO for creating / updating a Medicine.
 */
public class MedicineDTO {

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    @NotBlank(message = "Batch number is required")
    private String batchNumber;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    /** Location that receives the initial stock when adding (defaults to Main Pharmacy). */
    private Long locationId;

    public Long getLocationId()                         { return locationId; }
    public void setLocationId(Long locationId)          { this.locationId = locationId; }

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public String getMedicineName()                     { return medicineName; }
    public void   setMedicineName(String medicineName)  { this.medicineName = medicineName; }

    public String getCategory()                         { return category; }
    public void   setCategory(String category)          { this.category = category; }

    public String getManufacturer()                     { return manufacturer; }
    public void   setManufacturer(String manufacturer)  { this.manufacturer = manufacturer; }

    public String getBatchNumber()                      { return batchNumber; }
    public void   setBatchNumber(String batchNumber)    { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate()                    { return expiryDate; }
    public void      setExpiryDate(LocalDate expiryDate){ this.expiryDate = expiryDate; }

    public Integer getQuantity()                        { return quantity; }
    public void    setQuantity(Integer quantity)        { this.quantity = quantity; }

    public BigDecimal getPrice()                        { return price; }
    public void       setPrice(BigDecimal price)        { this.price = price; }
}

