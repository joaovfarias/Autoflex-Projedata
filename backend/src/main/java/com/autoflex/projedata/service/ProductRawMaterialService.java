package com.autoflex.projedata.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autoflex.projedata.dto.ProductRawMaterialDTO;
import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.entity.ProductRawMaterial;
import com.autoflex.projedata.entity.ProductRawMaterialId;
import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.repository.ProductRawMaterialRepository;
import com.autoflex.projedata.repository.ProductRepository;
import com.autoflex.projedata.repository.RawMaterialRepository;

@Service
public class ProductRawMaterialService {

    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final ProductRawMaterialRepository repository;

    public ProductRawMaterialService(ProductRepository productRepository,
            RawMaterialRepository rawMaterialRepository,
            ProductRawMaterialRepository repository) {
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
        this.repository = repository;
    }

    public ProductRawMaterial create(ProductRawMaterialDTO dto) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        ProductRawMaterial relation = new ProductRawMaterial(product, rawMaterial, dto.getRequiredQuantity());

        return repository.save(relation);
    }

    public void delete(Long productId, Long rawMaterialId) {
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterialId);

        repository.deleteById(id);
    }

    public List<ProductRawMaterial> findAll() {
        return repository.findAll();
    }
}
