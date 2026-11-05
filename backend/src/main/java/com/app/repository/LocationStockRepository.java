package com.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.modal.LocationStock;

public interface LocationStockRepository extends JpaRepository<LocationStock, Long> {

    List<LocationStock> findByLocationIdOrderByMedicineMedicineNameAsc(Long locationId);

    List<LocationStock> findByMedicineIdOrderByLocationNameAsc(Long medicineId);

    Optional<LocationStock> findByLocationIdAndMedicineId(Long locationId, Long medicineId);

    List<LocationStock> findByLocationIdAndQuantityLessThanOrderByQuantityAsc(Long locationId, Integer threshold);

    boolean existsByLocationIdAndQuantityGreaterThan(Long locationId, Integer quantity);

    void deleteByLocationId(Long locationId);

    void deleteByMedicineId(Long medicineId);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM LocationStock s WHERE s.medicine.id = :medicineId")
    Long totalForMedicine(@Param("medicineId") Long medicineId);
}

