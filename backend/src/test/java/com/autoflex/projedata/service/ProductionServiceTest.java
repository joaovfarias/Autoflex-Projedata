package com.autoflex.projedata.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.autoflex.projedata.dto.ProductionSummaryDTO;
import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.entity.ProductRawMaterial;
import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.repository.ProductRawMaterialRepository;
import com.autoflex.projedata.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
public class ProductionServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductRawMaterialRepository productRawMaterialRepository;

    @InjectMocks
    private ProductionService productionService;

    @Test
    void calculateProductionShouldPrioritizeHigherValueProductWhenUsingSharedMaterial() {
        Product highValue = new Product("P002", "Premium Chair", 20.0);
        highValue.setId(2L);

        Product lowValue = new Product("P001", "Basic Chair", 10.0);
        lowValue.setId(1L);

        RawMaterial wood = new RawMaterial("RM01", "Wood", 10);
        wood.setId(100L);

        ProductRawMaterial highValueRelation = new ProductRawMaterial(highValue, wood, 2);
        ProductRawMaterial lowValueRelation = new ProductRawMaterial(lowValue, wood, 1);

        when(productRepository.findAll()).thenReturn(new ArrayList<>(List.of(lowValue, highValue)));
        when(productRawMaterialRepository.findByIdProductId(2L)).thenReturn(List.of(highValueRelation));
        when(productRawMaterialRepository.findByIdProductId(1L)).thenReturn(List.of(lowValueRelation));

        ProductionSummaryDTO summary = productionService.calculateProduction();

        assertEquals(1, summary.getProducts().size());
        assertEquals("P002", summary.getProducts().get(0).getProductCode());
        assertEquals(5, summary.getProducts().get(0).getQuantityPossible());
        assertEquals(100.0, summary.getTotalProductionValue());
    }
}
