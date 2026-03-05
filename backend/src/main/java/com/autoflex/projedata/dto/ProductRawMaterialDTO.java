package com.autoflex.projedata.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRawMaterialDTO {

    private Long productId;
    private Long rawMaterialId;
    private Integer requiredQuantity;

}