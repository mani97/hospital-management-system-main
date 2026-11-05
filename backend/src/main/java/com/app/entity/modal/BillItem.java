package com.app.entity.modal;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A single medicine line in a PharmacyBill.
 */
@Entity
@Table(name = "bill_items")
public class BillItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    @JsonIgnore
    private PharmacyBill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Medicine medicine;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "line_total", precision = 10, scale = 2)
    private BigDecimal lineTotal;

    // ─── Constructors ────────────────────────────────────────────────────────

    public BillItem() {}

    public BillItem(Medicine medicine, Integer quantity, BigDecimal unitPrice) {
        this.medicine  = medicine;
        this.quantity  = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public PharmacyBill getBill()                         { return bill; }
    public void         setBill(PharmacyBill bill)        { this.bill = bill; }

    public Medicine getMedicine()                         { return medicine; }
    public void     setMedicine(Medicine medicine)        { this.medicine = medicine; }

    public Integer getQuantity()                          { return quantity; }
    public void    setQuantity(Integer quantity)          { this.quantity = quantity; }

    public BigDecimal getUnitPrice()                      { return unitPrice; }
    public void       setUnitPrice(BigDecimal unitPrice)  { this.unitPrice = unitPrice; }

    public BigDecimal getLineTotal()                      { return lineTotal; }
    public void       setLineTotal(BigDecimal lineTotal)  { this.lineTotal = lineTotal; }
}

