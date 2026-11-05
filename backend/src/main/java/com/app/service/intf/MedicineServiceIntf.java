package com.app.service.intf;

import java.util.List;

import com.app.dto.MedicineDTO;
import com.app.entity.modal.Medicine;

public interface MedicineServiceIntf {
    List<Medicine> getAll(String search);
    Medicine getById(Long id);
    Medicine add(MedicineDTO dto);
    Medicine update(Long id, MedicineDTO dto);
    Medicine updateStock(Long id, Long locationId, int quantity);
    void delete(Long id);
    List<Medicine> getLowStock(int threshold);
    List<Medicine> getExpired();
    List<Medicine> getExpiringWithin(int days);
}

