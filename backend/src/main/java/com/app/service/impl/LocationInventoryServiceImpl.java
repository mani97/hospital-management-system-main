package com.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.custome_exception.PharmacyBusinessException;
import com.app.custome_exception.ResourceNotFoundException;
import com.app.dto.LocationDTO;
import com.app.dto.StockTransferDTO;
import com.app.entity.modal.LocationStock;
import com.app.entity.modal.Medicine;
import com.app.entity.modal.PharmacyLocation;
import com.app.repository.LocationStockRepository;
import com.app.repository.MedicineRepository;
import com.app.repository.PharmacyLocationRepository;
import com.app.service.intf.LocationInventoryServiceIntf;

/**
 * Manages pharmacy locations and per-location stock. Keeps
 * {@code Medicine.quantity} equal to the total across all locations.
 */
@Service
@Transactional
public class LocationInventoryServiceImpl implements LocationInventoryServiceIntf, CommandLineRunner {

    public static final String DEFAULT_LOCATION = "Main Pharmacy";

    @Autowired private PharmacyLocationRepository locationRepo;
    @Autowired private LocationStockRepository stockRepo;
    @Autowired private MedicineRepository medicineRepo;

    /** Runs at startup so existing installs get a default location + migrated stock. */
    @Override
    public void run(String... args) {
        ensureDefaultLocationAndBackfill();
    }

    @Override
    public void ensureDefaultLocationAndBackfill() {
        PharmacyLocation main = locationRepo.findByNameIgnoreCase(DEFAULT_LOCATION).orElseGet(() -> {
            if (locationRepo.count() > 0) {
                return null; // admin already created own locations; do not force a default
            }
            PharmacyLocation l = new PharmacyLocation();
            l.setName(DEFAULT_LOCATION);
            l.setCity("");
            l.setAddress("");
            return locationRepo.save(l);
        });
        if (main == null) {
            return;
        }
        for (Medicine m : medicineRepo.findAll()) {
            if (stockRepo.findByMedicineIdOrderByLocationNameAsc(m.getId()).isEmpty() && m.getQuantity() != null
                    && m.getQuantity() > 0) {
                stockRepo.save(new LocationStock(main, m, m.getQuantity()));
            }
        }
    }

    // ---------------------------------------------------------------- locations

    @Override
    @Transactional(readOnly = true)
    public List<PharmacyLocation> getAllLocations() {
        return locationRepo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PharmacyLocation getLocation(Long id) {
        return locationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public PharmacyLocation resolveLocation(Long id) {
        if (id != null) {
            PharmacyLocation l = getLocation(id);
            if (!l.isActive()) {
                throw new PharmacyBusinessException("Location '" + l.getName() + "' is inactive");
            }
            return l;
        }
        return locationRepo.findByNameIgnoreCase(DEFAULT_LOCATION)
                .orElseGet(() -> locationRepo.findAll().stream().filter(PharmacyLocation::isActive).findFirst()
                        .orElseThrow(() -> new PharmacyBusinessException("No pharmacy location exists; create one first")));
    }

    @Override
    public PharmacyLocation createLocation(LocationDTO dto) {
        if (locationRepo.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new PharmacyBusinessException("Location already exists: " + dto.getName());
        }
        PharmacyLocation l = new PharmacyLocation();
        copy(dto, l);
        return locationRepo.save(l);
    }

    @Override
    public PharmacyLocation updateLocation(Long id, LocationDTO dto) {
        PharmacyLocation l = getLocation(id);
        locationRepo.findByNameIgnoreCase(dto.getName().trim()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new PharmacyBusinessException("Location already exists: " + dto.getName());
            }
        });
        copy(dto, l);
        return locationRepo.save(l);
    }

    @Override
    public void deleteLocation(Long id) {
        PharmacyLocation l = getLocation(id);
        if (stockRepo.existsByLocationIdAndQuantityGreaterThan(id, 0)) {
            throw new PharmacyBusinessException(
                    "Location still holds stock. Transfer the stock to another location first.");
        }
        try {
            stockRepo.deleteByLocationId(id);
            locationRepo.delete(l);
            locationRepo.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new PharmacyBusinessException("Location has billing history; mark it inactive instead");
        }
    }

    private void copy(LocationDTO dto, PharmacyLocation l) {
        l.setName(dto.getName().trim());
        l.setCity(dto.getCity() == null ? "" : dto.getCity().trim());
        l.setAddress(dto.getAddress() == null ? "" : dto.getAddress().trim());
        l.setActive(dto.getActive() == null || dto.getActive());
    }

    // -------------------------------------------------------------------- stock

    @Override
    @Transactional(readOnly = true)
    public List<LocationStock> getStockByLocation(Long locationId) {
        getLocation(locationId);
        return stockRepo.findByLocationIdOrderByMedicineMedicineNameAsc(locationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationStock> getStockByMedicine(Long medicineId) {
        return stockRepo.findByMedicineIdOrderByLocationNameAsc(medicineId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationStock> getLowStock(Long locationId, int threshold) {
        getLocation(locationId);
        return stockRepo.findByLocationIdAndQuantityLessThanOrderByQuantityAsc(locationId, threshold);
    }

    @Override
    public void setStock(Long locationId, Medicine medicine, int quantity) {
        if (quantity < 0) {
            throw new PharmacyBusinessException("Stock quantity cannot be negative");
        }
        PharmacyLocation loc = resolveLocation(locationId);
        LocationStock s = stockRepo.findByLocationIdAndMedicineId(loc.getId(), medicine.getId())
                .orElseGet(() -> new LocationStock(loc, medicine, 0));
        s.setQuantity(quantity);
        stockRepo.save(s);
        syncTotal(medicine);
    }

    @Override
    public void deduct(Long locationId, Medicine medicine, int quantity) {
        PharmacyLocation loc = resolveLocation(locationId);
        LocationStock s = stockRepo.findByLocationIdAndMedicineId(loc.getId(), medicine.getId()).orElse(null);
        int available = s == null ? 0 : s.getQuantity();
        if (available < quantity) {
            throw new PharmacyBusinessException("Insufficient stock for " + medicine.getMedicineName() + " at "
                    + loc.getName() + " (available " + available + ", requested " + quantity + ")");
        }
        s.setQuantity(available - quantity);
        stockRepo.save(s);
        syncTotal(medicine);
    }

    @Override
    public void transfer(StockTransferDTO dto) {
        if (dto.getFromLocationId().equals(dto.getToLocationId())) {
            throw new PharmacyBusinessException("Source and destination must be different");
        }
        Medicine med = medicineRepo.findById(dto.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id " + dto.getMedicineId()));
        PharmacyLocation to = resolveLocation(dto.getToLocationId());
        deduct(dto.getFromLocationId(), med, dto.getQuantity());
        LocationStock dest = stockRepo.findByLocationIdAndMedicineId(to.getId(), med.getId())
                .orElseGet(() -> new LocationStock(to, med, 0));
        dest.setQuantity(dest.getQuantity() + dto.getQuantity());
        stockRepo.save(dest);
        syncTotal(med);
    }

    @Override
    public void removeStockForMedicine(Long medicineId) {
        stockRepo.deleteByMedicineId(medicineId);
    }

    /** Keeps Medicine.quantity = sum of all location stock. */
    private void syncTotal(Medicine m) {
        stockRepo.flush();
        m.setQuantity(stockRepo.totalForMedicine(m.getId()).intValue());
        medicineRepo.save(m);
    }
}

