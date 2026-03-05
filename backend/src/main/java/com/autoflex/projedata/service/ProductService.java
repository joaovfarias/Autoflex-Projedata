package com.autoflex.projedata.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product product = findById(id);
        product.setCode(updated.getCode());
        product.setName(updated.getName());
        product.setValue(updated.getValue());
        return repository.save(product);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}