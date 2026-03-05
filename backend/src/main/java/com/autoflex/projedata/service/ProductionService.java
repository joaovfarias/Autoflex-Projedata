package com.autoflex.projedata.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.autoflex.projedata.dto.ProductionResultDTO;
import com.autoflex.projedata.dto.ProductionSummaryDTO;
import com.autoflex.projedata.entity.Product;
import com.autoflex.projedata.entity.ProductRawMaterial;
import com.autoflex.projedata.entity.RawMaterial;
import com.autoflex.projedata.repository.ProductRawMaterialRepository;
import com.autoflex.projedata.repository.ProductRepository;

@Service
public class ProductionService {

    private final ProductRepository productRepository;
    private final ProductRawMaterialRepository productRawMaterialRepository;

    public ProductionService(ProductRepository productRepository,
            ProductRawMaterialRepository productRawMaterialRepository) {
        this.productRepository = productRepository;
        this.productRawMaterialRepository = productRawMaterialRepository;
    }

    public ProductionSummaryDTO calculateProduction() {

        List<Product> products = productRepository.findAll();

        products.sort(Comparator.comparing(Product::getValue).reversed());

        List<ProductionResultDTO> result = new ArrayList<>();
        Map<Long, Integer> stockMap = new HashMap<>();

        // construir estoque temporário
        for (Product product : products) {
            List<ProductRawMaterial> relations = productRawMaterialRepository.findByIdProductId(product.getId());

            for (ProductRawMaterial relation : relations) {
                RawMaterial rm = relation.getRawMaterial();
                stockMap.putIfAbsent(rm.getId(), rm.getStockQuantity());
            }
        }

        double totalProductionValue = 0.0;

        // simulação
        for (Product product : products) {

            List<ProductRawMaterial> relations = productRawMaterialRepository.findByIdProductId(product.getId());

            if (relations.isEmpty())
                continue;

            int maxProduction = Integer.MAX_VALUE;

            for (ProductRawMaterial relation : relations) {

                Long rawId = relation.getRawMaterial().getId();
                int availableStock = stockMap.get(rawId);
                int required = relation.getRequiredQuantity();

                int possible = availableStock / required;

                if (possible < maxProduction) {
                    maxProduction = possible;
                }
            }

            if (maxProduction > 0) {

                for (ProductRawMaterial relation : relations) {

                    Long rawId = relation.getRawMaterial().getId();
                    int required = relation.getRequiredQuantity();

                    int newStock = stockMap.get(rawId) - (required * maxProduction);
                    stockMap.put(rawId, newStock);
                }

                double productTotalValue = maxProduction * product.getValue();
                totalProductionValue += productTotalValue;

                result.add(new ProductionResultDTO(
                        product.getCode(),
                        product.getName(),
                        maxProduction,
                        productTotalValue));
            }
        }

        return new ProductionSummaryDTO(result, totalProductionValue);
    }
}