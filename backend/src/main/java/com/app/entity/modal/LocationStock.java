package com.app.entity.modal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Stock of one medicine at one location. {@code Medicine.quantity} always
 * equals the sum of its LocationStock rows (maintained by the service layer).
 */
@Entity
@Table(name = "location_stock",
       uniqueConstraints = @UniqueConstraint(columnNames = { "location_id", "medicine_id" }))
public class LocationStock extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private PharmacyLocation location;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "medicine_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Medicine medicine;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    public LocationStock() {}

    public LocationStock(PharmacyLocation location, Medicine medicine, Integer quantity) {
        this.location = location;
        this.medicine = medicine;
        this.quantity = quantity;
    }

    public PharmacyLocation getLocation() { return location; }
    public void setLocation(PharmacyLocation location) { this.location = location; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

