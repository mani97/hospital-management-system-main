package com.app.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.LocationDTO;
import com.app.dto.StockTransferDTO;
import com.app.entity.modal.LocationStock;
import com.app.entity.modal.PharmacyLocation;
import com.app.service.intf.LocationInventoryServiceIntf;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LocationController {

    @Autowired
    private LocationInventoryServiceIntf service;

    @GetMapping
    public List<PharmacyLocation> getAll() { return service.getAllLocations(); }

    @GetMapping("/{id}")
    public PharmacyLocation get(@PathVariable Long id) { return service.getLocation(id); }

    @PostMapping
    public ResponseEntity<PharmacyLocation> create(@RequestBody @Valid LocationDTO dto) {
        return new ResponseEntity<>(service.createLocation(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public PharmacyLocation update(@PathVariable Long id, @RequestBody @Valid LocationDTO dto) {
        return service.updateLocation(id, dto);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        service.deleteLocation(id);
        return Map.of("message", "Location deleted");
    }

    /** All medicines stocked at a location. */
    @GetMapping("/{id}/stock")
    public List<LocationStock> stock(@PathVariable Long id) { return service.getStockByLocation(id); }

    /** Low stock alert for one location. */
    @GetMapping("/{id}/stock/low")
    public List<LocationStock> low(@PathVariable Long id, @RequestParam(defaultValue = "10") int threshold) {
        return service.getLowStock(id, threshold);
    }

    /** Availability of one medicine across all locations. */
    @GetMapping("/medicine/{medicineId}/stock")
    public List<LocationStock> byMedicine(@PathVariable Long medicineId) {
        return service.getStockByMedicine(medicineId);
    }

    /** Move stock between locations. */
    @PostMapping("/transfer")
    public Map<String, String> transfer(@RequestBody @Valid StockTransferDTO dto) {
        service.transfer(dto);
        return Map.of("message", "Stock transferred");
    }
}

