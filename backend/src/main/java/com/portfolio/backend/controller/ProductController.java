package com.portfolio.backend.controller;

import com.portfolio.backend.service.ProductService;
import com.portfolio.backend.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public java.util.Map<String, Object> getProductList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getProductList(page, size);
    }

    @GetMapping("/{id}")
    public ProductVO getProduct(@PathVariable int id) {
        return productService.getProduct(id);
    }

    @PostMapping
    public void createProduct(ProductVO vo, @RequestParam(value = "file", required = false) MultipartFile file) {
        productService.registerProduct(vo, file);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public void updateProduct(@PathVariable int id, ProductVO productVO, @RequestParam(value = "file", required = false) MultipartFile file) {
        productVO.setProdId(id);
        productService.updateProduct(productVO, file);
    }
}
