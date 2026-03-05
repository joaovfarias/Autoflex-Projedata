package com.autoflex.projedata.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "P_NAME", nullable = false)
    private String name;

    @Column(name = "P_VALUE", nullable = false)
    private Double value;

    public Product() {
    }

    public Product(String code, String name, Double value) {
        this.code = code;
        this.name = name;
        this.value = value;
    }
}
