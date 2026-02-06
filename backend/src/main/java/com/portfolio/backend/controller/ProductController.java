package com.portfolio.backend.controller;

import com.portfolio.backend.service.ProductService;
import com.portfolio.backend.dto.ProductDto;
import com.portfolio.backend.dto.PageResponse;
import jakarta.validation.Valid;
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
    public PageResponse<ProductDto.Response> getProductList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getProductList(page, size);
    }

    @GetMapping("/{id}")
    public ProductDto.Response getProduct(@PathVariable int id) {
        return productService.getProduct(id);
    }

    @PostMapping
    public void createProduct(@Valid ProductDto.Request dto, @RequestParam(value = "file", required = false) MultipartFile file) {
        productService.registerProduct(dto, file);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
    }

    @PostMapping("/{id}")
    public void updateProduct(@PathVariable int id, @Valid ProductDto.Request dto, @RequestParam(value = "file", required = false) MultipartFile file) {
        productService.updateProduct(id, dto, file);
    }
}
