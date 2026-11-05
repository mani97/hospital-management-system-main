package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.modal.PharmacyLocation;

public interface PharmacyLocationRepository extends JpaRepository<PharmacyLocation, Long> {
    boolean existsByNameIgnoreCase(String name);
    java.util.Optional<PharmacyLocation> findByNameIgnoreCase(String name);
}

