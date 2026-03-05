package com.autoflex.projedata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.autoflex.projedata.dto.ProductRawMaterialDTO;
import com.autoflex.projedata.entity.ProductRawMaterial;
import com.autoflex.projedata.service.ProductRawMaterialService;

@RestController
@RequestMapping("/product-raw-materials")
public class ProductRawMaterialController {

    private final ProductRawMaterialService service;

    public ProductRawMaterialController(ProductRawMaterialService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductRawMaterial> getAll() {
        return service.findAll();
    }

    @PostMapping
    public ProductRawMaterial create(@RequestBody ProductRawMaterialDTO dto) {
        return service.create(dto);
    }

    @DeleteMapping
    public void delete(@RequestParam Long productId,
            @RequestParam Long rawMaterialId) {
        service.delete(productId, rawMaterialId);
    }
}
