package com.autoflex.projedata.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.exception.DuplicateProductCodeException;
import com.autoflex.projedata.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setCode("P001");
        product.setName("Chair");
        product.setValue(120.0);
    }

    @Test
    void findAllShouldReturnAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<Product> result = productService.findAll();

        assertEquals(1, result.size());
        assertEquals("P001", result.get(0).getCode());
        verify(productRepository).findAll();
    }

    @Test
    void findByIdShouldReturnProductWhenFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.findById(1L);

        assertEquals("Chair", result.getName());
        verify(productRepository).findById(1L);
    }

    @Test
    void findByIdShouldThrowWhenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> productService.findById(99L));

        assertEquals("Product not found", exception.getMessage());
    }

    @Test
    void saveShouldPersistWhenCodeIsUnique() {
        when(productRepository.existsByCode("P001")).thenReturn(false);
        when(productRepository.save(product)).thenReturn(product);

        Product result = productService.save(product);

        assertEquals("P001", result.getCode());
        verify(productRepository).existsByCode("P001");
        verify(productRepository).save(product);
    }

    @Test
    void saveShouldThrowWhenCodeAlreadyExists() {
        when(productRepository.existsByCode("P001")).thenReturn(true);

        DuplicateProductCodeException exception = assertThrows(
                DuplicateProductCodeException.class,
                () -> productService.save(product));

        assertEquals("Product code already exists", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateShouldPersistWhenCodeUnchanged() {
        Product updated = new Product();
        updated.setCode("P001");
        updated.setName("Chair New");
        updated.setValue(150.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product result = productService.update(1L, updated);

        assertEquals("P001", result.getCode());
        assertEquals("Chair New", result.getName());
        assertEquals(150.0, result.getValue());
        verify(productRepository, never()).existsByCode("P001");
        verify(productRepository).save(product);
    }

    @Test
    void updateShouldThrowWhenChangingToExistingCode() {
        Product updated = new Product();
        updated.setCode("P002");
        updated.setName("Chair New");
        updated.setValue(150.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByCode("P002")).thenReturn(true);

        DuplicateProductCodeException exception = assertThrows(
                DuplicateProductCodeException.class,
                () -> productService.update(1L, updated));

        assertEquals("Product code already exists", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteShouldDelegateToRepository() {
        productService.delete(1L);

        verify(productRepository).deleteById(1L);
    }
}
