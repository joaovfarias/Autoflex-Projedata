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

import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.exception.DuplicateRawMaterialCodeException;
import com.autoflex.projedata.exception.LinkedMaterialRawProductException;
import com.autoflex.projedata.repository.ProductRawMaterialRepository;
import com.autoflex.projedata.repository.RawMaterialRepository;

@ExtendWith(MockitoExtension.class)
class RawMaterialServiceTest {

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @Mock
    private ProductRawMaterialRepository productRawMaterialRepository;

    @InjectMocks
    private RawMaterialService rawMaterialService;

    private RawMaterial rawMaterial;

    @BeforeEach
    void setUp() {
        rawMaterial = new RawMaterial();
        rawMaterial.setId(1L);
        rawMaterial.setCode("RM001");
        rawMaterial.setName("Wood");
        rawMaterial.setStockQuantity(50);
    }

    @Test
    void findAllShouldReturnAllRawMaterials() {
        when(rawMaterialRepository.findAll()).thenReturn(List.of(rawMaterial));

        List<RawMaterial> result = rawMaterialService.findAll();

        assertEquals(1, result.size());
        assertEquals("RM001", result.get(0).getCode());
        verify(rawMaterialRepository).findAll();
    }

    @Test
    void saveShouldThrowWhenCodeAlreadyExists() {
        when(rawMaterialRepository.existsByCode("RM001")).thenReturn(true);

        DuplicateRawMaterialCodeException exception = assertThrows(
                DuplicateRawMaterialCodeException.class,
                () -> rawMaterialService.save(rawMaterial));

        assertEquals("Raw material code already exists", exception.getMessage());
        verify(rawMaterialRepository, never()).save(any(RawMaterial.class));
    }

    @Test
    void updateShouldPersistWhenCodeIsUnique() {
        RawMaterial updated = new RawMaterial();
        updated.setCode("RM002");
        updated.setName("Oak Wood");
        updated.setStockQuantity(30);

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(rawMaterial));
        when(rawMaterialRepository.existsByCode("RM002")).thenReturn(false);
        when(rawMaterialRepository.save(any(RawMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RawMaterial result = rawMaterialService.update(1L, updated);

        assertEquals("RM002", result.getCode());
        assertEquals("Oak Wood", result.getName());
        assertEquals(30, result.getStockQuantity());
        verify(rawMaterialRepository).save(rawMaterial);
    }

    @Test
    void deleteShouldThrowWhenRawMaterialIsLinkedToProduct() {
        when(productRawMaterialRepository.existsByIdRawMaterialId(1L)).thenReturn(true);

        LinkedMaterialRawProductException exception = assertThrows(
                LinkedMaterialRawProductException.class,
                () -> rawMaterialService.delete(1L));

        assertEquals("Cannot delete raw material linked to products", exception.getMessage());
        verify(rawMaterialRepository, never()).deleteById(1L);
    }
}
