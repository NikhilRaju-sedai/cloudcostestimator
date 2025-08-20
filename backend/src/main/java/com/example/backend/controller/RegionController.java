package com.example.backend.controller;
import com.example.backend.model.Region;
import com.example.backend.model.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend.service.RegionService;


@RestController
@RequestMapping("/api/regions")
public class RegionController {

    @Autowired
    private  RegionService regionService;


    @GetMapping
    public List<Region> getAllRegions() {
        return regionService.getAllRegions();
    }


    // Example of nested endpoint
    @GetMapping("/{id}/resources")
    public List<Resource> getResourcesByRegionId(@PathVariable Long id) {
        return regionService.getResourcesByRegionId(id);
    }
}
