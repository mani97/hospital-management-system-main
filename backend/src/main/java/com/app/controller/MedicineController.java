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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.MedicineDTO;
import com.app.entity.modal.Medicine;
import com.app.service.intf.MedicineServiceIntf;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MedicineController {

    @Autowired
    private MedicineServiceIntf medicineService;

    /** GET /api/medicines?search=para */
    @GetMapping
    public List<Medicine> getAll(@RequestParam(required = false) String search) {
        return medicineService.getAll(search);
    }

    @GetMapping("/{id}")
    public Medicine getById(@PathVariable Long id) {
        return medicineService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Medicine> add(@RequestBody @Valid MedicineDTO dto) {
        return new ResponseEntity<>(medicineService.add(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Medicine update(@PathVariable Long id, @RequestBody @Valid MedicineDTO dto) {
        return medicineService.update(id, dto);
    }

    /** PATCH /api/medicines/{id}/stock  body: {"quantity": 50, "locationId": 1} (locationId optional) */
    @PatchMapping("/{id}/stock")
    public Medicine updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer qty = body.get("quantity");
        if (qty == null) {
            throw new com.app.custome_exception.PharmacyBusinessException("quantity is required");
        }
        Integer loc = body.get("locationId");
        return medicineService.updateStock(id, loc == null ? null : loc.longValue(), qty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        medicineService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Medicine deleted successfully"));
    }

    /** Low stock alerts. GET /api/medicines/alerts/low-stock?threshold=10 */
    @GetMapping("/alerts/low-stock")
    public List<Medicine> lowStock(@RequestParam(defaultValue = "10") int threshold) {
        return medicineService.getLowStock(threshold);
    }

    @GetMapping("/alerts/expired")
    public List<Medicine> expired() {
        return medicineService.getExpired();
    }

    @GetMapping("/alerts/expiring")
    public List<Medicine> expiring(@RequestParam(defaultValue = "30") int days) {
        return medicineService.getExpiringWithin(days);
    }
}

