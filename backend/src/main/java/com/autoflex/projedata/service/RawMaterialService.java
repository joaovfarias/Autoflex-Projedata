package com.autoflex.projedata.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.exception.DuplicateRawMaterialCodeException;
import com.autoflex.projedata.exception.LinkedMaterialRawProductException;
import com.autoflex.projedata.repository.ProductRawMaterialRepository;
import com.autoflex.projedata.repository.RawMaterialRepository;

@Service
public class RawMaterialService {

    private final RawMaterialRepository repository;
    private final ProductRawMaterialRepository productRawMaterialRepository;

    public RawMaterialService(RawMaterialRepository repository,
            ProductRawMaterialRepository productRawMaterialRepository) {
        this.repository = repository;
        this.productRawMaterialRepository = productRawMaterialRepository;
    }

    public List<RawMaterial> findAll() {
        return repository.findAll();
    }

    public RawMaterial findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));
    }

    public RawMaterial save(RawMaterial rawMaterial) {
        if (repository.existsByCode(rawMaterial.getCode())) {
            throw new DuplicateRawMaterialCodeException("Raw material code already exists");
        }
        return repository.save(rawMaterial);
    }

    public RawMaterial update(Long id, RawMaterial updated) {
        RawMaterial rm = findById(id);

        if (!rm.getCode().equals(updated.getCode()) && repository.existsByCode(updated.getCode())) {
            throw new DuplicateRawMaterialCodeException("Raw material code already exists");
        }
        rm.setCode(updated.getCode());
        rm.setName(updated.getName());
        rm.setStockQuantity(updated.getStockQuantity());
        return repository.save(rm);
    }

    public void delete(Long id) {
        if (productRawMaterialRepository.existsByIdRawMaterialId(id)) {
            throw new LinkedMaterialRawProductException("Cannot delete raw material linked to products");
        }
        repository.deleteById(id);
    }
}