package com.autoflex.projedata.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductionResultDTO {

    private String productCode;
    private String productName;
    private Integer quantityPossible;
    private Double totalValue;

    public ProductionResultDTO(String productCode, String productName,
            Integer quantityPossible, Double totalValue) {
        this.productCode = productCode;
        this.productName = productName;
        this.quantityPossible = quantityPossible;
        this.totalValue = totalValue;
    }

}