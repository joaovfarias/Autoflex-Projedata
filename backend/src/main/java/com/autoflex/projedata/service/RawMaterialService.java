package com.autoflex.projedata.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.repository.RawMaterialRepository;

@Service
public class RawMaterialService {

    private final RawMaterialRepository repository;

    public RawMaterialService(RawMaterialRepository repository) {
        this.repository = repository;
    }

    public List<RawMaterial> findAll() {
        return repository.findAll();
    }

    public RawMaterial findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));
    }

    public RawMaterial save(RawMaterial rawMaterial) {
        return repository.save(rawMaterial);
    }

    public RawMaterial update(Long id, RawMaterial updated) {
        RawMaterial rm = findById(id);
        rm.setCode(updated.getCode());
        rm.setName(updated.getName());
        rm.setStockQuantity(updated.getStockQuantity());
        return repository.save(rm);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}