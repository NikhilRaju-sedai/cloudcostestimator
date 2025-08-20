package com.example.backend.service;

import com.example.backend.model.Region;
import com.example.backend.model.Resource;
import com.example.backend.repository.RegionRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class RegionService {

    private final RegionRepository regionRepository;

    public RegionService(RegionRepository regionRepository) {
        this.regionRepository = regionRepository;
    }

    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }


    // Assuming Region has getResources() method (OneToMany mapping)
    public List<Resource> getResourcesByRegionId(Long regionId) {
        List<Resource> list1= regionRepository.findResourcesByRegionId(regionId);
        if (list1 == null || list1.isEmpty()) {
            throw new RuntimeException("No resources found for region with id " + regionId);
        }
        // Return the list of resources associated with the region
        return list1;
    }

}

