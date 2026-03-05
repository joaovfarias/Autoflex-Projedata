package com.autoflex.projedata.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.autoflex.projedata.controller.ProductController;
import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.exception.DuplicateProductCodeException;
import com.autoflex.projedata.service.ProductService;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private Product product;

    @BeforeEach
    void setUp() {
        product = createProduct(1L, "P001", "Chair", 120.0);
    }

    @Test
    void getAllShouldReturnProducts() throws Exception {
        Product product2 = createProduct(2L, "P002", "Table", 280.0);

        when(productService.findAll()).thenReturn(List.of(product, product2));

        List<Product> result = productController.getAll();

        assertEquals(2, result.size());
        assertEquals("P001", result.get(0).getCode());
        verify(productService).findAll();
    }

    @Test
    void getByIdShouldReturnProduct() {
        when(productService.findById(1L)).thenReturn(product);

        Product result = productController.getById(1L);

        assertEquals("P001", result.getCode());
        verify(productService).findById(1L);
    }

    @Test
    void createShouldReturnSavedProduct() {
        when(productService.save(product)).thenReturn(product);

        Product result = productController.create(product);

        assertEquals("P001", result.getCode());
        verify(productService).save(product);
    }

    @Test
    void createShouldThrowWhenCodeAlreadyExists() {
        when(productService.save(product))
                .thenThrow(new DuplicateProductCodeException("Product code already exists"));

        DuplicateProductCodeException exception = assertThrows(
                DuplicateProductCodeException.class,
                () -> productController.create(product));

        assertEquals("Product code already exists", exception.getMessage());
    }

    @Test
    void updateShouldReturnUpdatedProduct() {
        Product updated = createProduct(null, "P001", "Chair Premium", 150.0);
        Product saved = createProduct(1L, "P001", "Chair Premium", 150.0);
        when(productService.update(1L, updated)).thenReturn(saved);

        Product result = productController.update(1L, updated);

        assertEquals("Chair Premium", result.getName());
        verify(productService).update(1L, updated);
    }

    private static Product createProduct(Long id, String code, String name, Double value) {
        Product product = new Product();
        product.setId(id);
        product.setCode(code);
        product.setName(name);
        product.setValue(value);
        return product;
    }
}
