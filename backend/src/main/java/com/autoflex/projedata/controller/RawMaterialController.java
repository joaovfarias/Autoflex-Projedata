package com.autoflex.projedata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.service.RawMaterialService;

@RestController
@RequestMapping("/raw-materials")
public class RawMaterialController {

    private final RawMaterialService service;

    public RawMaterialController(RawMaterialService service) {
        this.service = service;
    }

    @GetMapping
    public List<RawMaterial> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RawMaterial getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public RawMaterial create(@RequestBody RawMaterial rawMaterial) {
        return service.save(rawMaterial);
    }

    @PutMapping("/{id}")
    public RawMaterial update(@PathVariable Long id,
            @RequestBody RawMaterial rawMaterial) {
        return service.update(id, rawMaterial);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
