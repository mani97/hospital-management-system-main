package com.app.dto;

import javax.validation.constraints.NotBlank;

public class LocationDTO {

    @NotBlank(message = "Location name is required")
    private String name;
    private String city;
    private String address;
    private Boolean active = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

