package com.app.service.intf;

import java.util.List;

import com.app.dto.LocationDTO;
import com.app.dto.StockTransferDTO;
import com.app.entity.modal.LocationStock;
import com.app.entity.modal.Medicine;
import com.app.entity.modal.PharmacyLocation;

public interface LocationInventoryServiceIntf {
    // Locations
    List<PharmacyLocation> getAllLocations();
    PharmacyLocation getLocation(Long id);
    PharmacyLocation createLocation(LocationDTO dto);
    PharmacyLocation updateLocation(Long id, LocationDTO dto);
    void deleteLocation(Long id);
    /** Returns the given location, or the default "Main Pharmacy" when id is null. */
    PharmacyLocation resolveLocation(Long id);

    // Stock
    List<LocationStock> getStockByLocation(Long locationId);
    List<LocationStock> getStockByMedicine(Long medicineId);
    List<LocationStock> getLowStock(Long locationId, int threshold);
    void setStock(Long locationId, Medicine medicine, int quantity);
    void deduct(Long locationId, Medicine medicine, int quantity);
    void transfer(StockTransferDTO dto);
    void removeStockForMedicine(Long medicineId);

    /** Creates the default location and moves legacy stock into it (idempotent). */
    void ensureDefaultLocationAndBackfill();
}

