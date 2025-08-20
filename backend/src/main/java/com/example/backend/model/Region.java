package com.example.backend.model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer multiplier;

    @ManyToMany
    @JoinTable(
            name = "region_resource",
            joinColumns = @JoinColumn(name = "region_id"),
            inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    private List<Resource> resources;

    // getters and setters
    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }
    public Integer getMultiplier() {
        return multiplier;
    }
    public void setMultiplier(Integer multiplier) {
        this.multiplier = multiplier;
    }
}

