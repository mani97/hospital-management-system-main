package com.app.entity.modal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;

/**
 * Entity representing a Medicine in the pharmacy inventory.
 */
@Entity
@Table(name = "medicines")
public class Medicine extends BaseEntity {

    @NotBlank(message = "Medicine name is required")
    @Column(name = "medicine_name", nullable = false, length = 100)
    private String medicineName;

    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @NotBlank(message = "Manufacturer is required")
    @Column(name = "manufacturer", nullable = false, length = 100)
    private String manufacturer;

    @NotBlank(message = "Batch number is required")
    @Column(name = "batch_number", nullable = false, length = 50, unique = true)
    private String batchNumber;

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    // ─── Constructors ────────────────────────────────────────────────────────

    public Medicine() {}

    public Medicine(String medicineName, String category, String manufacturer,
                    String batchNumber, LocalDate expiryDate, Integer quantity, BigDecimal price) {
        this.medicineName = medicineName;
        this.category     = category;
        this.manufacturer = manufacturer;
        this.batchNumber  = batchNumber;
        this.expiryDate   = expiryDate;
        this.quantity     = quantity;
        this.price        = price;
    }

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

    public LocalDateTime getCreatedDate()               { return createdDate; }
    public void          setCreatedDate(LocalDateTime c){ this.createdDate = c; }

    /** Convenience: check if stock is below threshold */
    public boolean isLowStock(int threshold) {
        return this.quantity != null && this.quantity < threshold;
    }

    /** Convenience: check if medicine is expired */
    public boolean isExpired() {
        return this.expiryDate != null && this.expiryDate.isBefore(LocalDate.now());
    }

    @Override
    public String toString() {
        return "Medicine{name='" + medicineName + "', batch='" + batchNumber + "', qty=" + quantity + "}";
    }
}

