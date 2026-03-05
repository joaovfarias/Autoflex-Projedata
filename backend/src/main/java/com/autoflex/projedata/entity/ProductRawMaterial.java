package com.autoflex.projedata.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "PRODUCT_RAW_MATERIAL")
public class ProductRawMaterial {

    @EmbeddedId
    private ProductRawMaterialId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("rawMaterialId")
    @JoinColumn(name = "raw_material_id")
    private RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false)
    private int requiredQuantity;

    public ProductRawMaterial() {
    }

    public ProductRawMaterial(Product product, RawMaterial rawMaterial, int requiredQuantity) {
        this.product = product;
        this.rawMaterial = rawMaterial;
        this.requiredQuantity = requiredQuantity;
        this.id = new ProductRawMaterialId(product.getId(), rawMaterial.getId());
    }
}
