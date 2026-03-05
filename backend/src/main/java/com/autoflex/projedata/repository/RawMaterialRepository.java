package com.autoflex.projedata.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.autoflex.projedata.entity.RawMaterial;

@Repository
public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {

    Optional<RawMaterial> findByCode(String code);

}
