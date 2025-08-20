package com.example.backend.repository;

import com.example.backend.model.Region;
import com.example.backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Long> {

    @Query("SELECT r.resources FROM Region r WHERE r.id = :regionId")
    List<Resource> findResourcesByRegionId(@Param("regionId") Long regionId);
}
