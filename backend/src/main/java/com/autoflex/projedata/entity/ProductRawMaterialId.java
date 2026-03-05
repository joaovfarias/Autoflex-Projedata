package com.autoflex.projedata.entity;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProductRawMaterialId implements Serializable {

    private Long productId;
    private Long rawMaterialId;

    public ProductRawMaterialId() {
    }

    public ProductRawMaterialId(Long productId, Long rawMaterialId) {
        this.productId = productId;
        this.rawMaterialId = rawMaterialId;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        ProductRawMaterialId that = (ProductRawMaterialId) o;

        if (!productId.equals(that.productId))
            return false;
        return rawMaterialId.equals(that.rawMaterialId);
    }

    @Override
    public int hashCode() {
        int result = productId.hashCode();
        result = 31 * result + rawMaterialId.hashCode();
        return result;
    }
}
