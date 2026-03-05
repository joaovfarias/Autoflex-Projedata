package com.autoflex.projedata.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autoflex.projedata.dto.ProductionSummaryDTO;
import com.autoflex.projedata.service.ProductionService;

@RestController
@RequestMapping("/production")
public class ProductionController {

    private final ProductionService service;

    public ProductionController(ProductionService service) {
        this.service = service;
    }

    @GetMapping
    public ProductionSummaryDTO calculate() {
        return service.calculateProduction();
    }
}
