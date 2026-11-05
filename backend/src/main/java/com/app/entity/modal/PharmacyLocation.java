package com.app.entity.modal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

/** A pharmacy branch / store that holds its own medicine stock. */
@Entity
@Table(name = "pharmacy_locations")
public class PharmacyLocation extends BaseEntity {

    @NotBlank(message = "Location name is required")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public PharmacyLocation() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}

