package com.autoflex.projedata.dto;

import java.util.List;

public class ProductionSummaryDTO {

    private List<ProductionResultDTO> products;
    private Double totalProductionValue;

    public ProductionSummaryDTO(List<ProductionResultDTO> products,
            Double totalProductionValue) {
        this.products = products;
        this.totalProductionValue = totalProductionValue;
    }

    public List<ProductionResultDTO> getProducts() {
        return products;
    }

    public Double getTotalProductionValue() {
        return totalProductionValue;
    }
}
