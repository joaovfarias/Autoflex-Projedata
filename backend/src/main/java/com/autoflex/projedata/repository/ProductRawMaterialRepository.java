package com.autoflex.projedata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.autoflex.projedata.entity.ProductRawMaterial;
import com.autoflex.projedata.entity.ProductRawMaterialId;

@Repository
public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, ProductRawMaterialId> {

    List<ProductRawMaterial> findByIdProductId(Long productId);
}
