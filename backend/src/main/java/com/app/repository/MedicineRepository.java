package com.app.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.modal.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    boolean existsByBatchNumber(String batchNumber);

    /** Case-insensitive search across name, category and manufacturer. */
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :q, '%')) "
         + "OR LOWER(m.category) LIKE LOWER(CONCAT('%', :q, '%')) "
         + "OR LOWER(m.manufacturer) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Medicine> search(@Param("q") String q);

    List<Medicine> findByQuantityLessThanOrderByQuantityAsc(Integer threshold);

    List<Medicine> findByExpiryDateBeforeOrderByExpiryDateAsc(LocalDate date);

    List<Medicine> findByExpiryDateBetweenOrderByExpiryDateAsc(LocalDate from, LocalDate to);
}

