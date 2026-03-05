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

import com.autoflex.projedata.controller.RawMaterialController;
import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.exception.DuplicateRawMaterialCodeException;
import com.autoflex.projedata.service.RawMaterialService;

@ExtendWith(MockitoExtension.class)
class RawMaterialControllerTest {

    @Mock
    private RawMaterialService rawMaterialService;

    @InjectMocks
    private RawMaterialController rawMaterialController;

    private RawMaterial rawMaterial;

    @BeforeEach
    void setUp() {
        rawMaterial = createRawMaterial(1L, "RM001", "Wood", 50);
    }

    @Test
    void getAllShouldReturnRawMaterials() {
        RawMaterial rawMaterial2 = createRawMaterial(2L, "RM002", "Iron", 30);
        when(rawMaterialService.findAll()).thenReturn(List.of(rawMaterial, rawMaterial2));

        List<RawMaterial> result = rawMaterialController.getAll();

        assertEquals(2, result.size());
        assertEquals("RM001", result.get(0).getCode());
        verify(rawMaterialService).findAll();
    }

    @Test
    void createShouldThrowWhenCodeAlreadyExists() {
        when(rawMaterialService.save(rawMaterial))
                .thenThrow(new DuplicateRawMaterialCodeException("Raw material code already exists"));

        DuplicateRawMaterialCodeException exception = assertThrows(
                DuplicateRawMaterialCodeException.class,
                () -> rawMaterialController.create(rawMaterial));

        assertEquals("Raw material code already exists", exception.getMessage());
    }

    @Test
    void updateShouldReturnUpdatedRawMaterial() {
        RawMaterial updated = createRawMaterial(null, "RM001", "Wood Premium", 80);
        RawMaterial saved = createRawMaterial(1L, "RM001", "Wood Premium", 80);
        when(rawMaterialService.update(1L, updated)).thenReturn(saved);

        RawMaterial result = rawMaterialController.update(1L, updated);

        assertEquals("Wood Premium", result.getName());
        assertEquals(80, result.getStockQuantity());
        verify(rawMaterialService).update(1L, updated);
    }

    private static RawMaterial createRawMaterial(Long id, String code, String name, Integer stockQuantity) {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setId(id);
        rawMaterial.setCode(code);
        rawMaterial.setName(name);
        rawMaterial.setStockQuantity(stockQuantity);
        return rawMaterial;
    }
}
