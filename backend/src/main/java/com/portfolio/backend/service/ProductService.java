package com.portfolio.backend.service;

import com.portfolio.backend.mapper.ProductMapper;
import com.portfolio.backend.vo.ProductVO;
import com.portfolio.backend.dto.ProductDto;
import com.portfolio.backend.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductMapper productMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PageResponse<ProductDto.Response> getProductList(int page, int size) {
        int offset = (page - 1) * size;
        List<ProductVO> list = productMapper.selectProductList(size, offset);
        int total = productMapper.selectProductCount();

        List<ProductDto.Response> dtos = list.stream().map(this::toResponse).toList();

        return new PageResponse<>(dtos, total);
    }

    public ProductDto.Response getProduct(int prodId) {
        ProductVO vo = productMapper.selectProductById(prodId);
        return toResponse(vo);
    }

    public void registerProduct(ProductDto.Request dto, MultipartFile file) {
        ProductVO vo = new ProductVO();
        vo.setProdName(dto.getProdName());
        vo.setProdPrice(dto.getProdPrice());
        vo.setProdStock(dto.getProdStock());
        vo.setProdCategory(dto.getProdCategory());
        vo.setProdDesc(dto.getProdDesc());
        vo.setProdStatus(dto.getProdStatus() != null ? dto.getProdStatus() : "ON_SALE");

        if(file != null && !file.isEmpty()) {
            try {
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String savedFileName = UUID.randomUUID().toString() + extension;

                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                File dest = new File(dir, savedFileName);
                file.transferTo(dest);
                vo.setProdImg(savedFileName);
            }
            catch(IOException e) {
                e.printStackTrace();
                throw new RuntimeException("상품 등록 중 파일 업로드 오류", e);
            }
        }

        productMapper.insertProduct(vo);
    }

    public void deleteProduct(int prodId) {
        productMapper.deleteProduct(prodId);
    }

    public void updateProduct(int id, ProductDto.Request dto, MultipartFile file) {
        ProductVO vo = new ProductVO();
        vo.setProdId(id);
        vo.setProdName(dto.getProdName());
        vo.setProdPrice(dto.getProdPrice());
        vo.setProdStock(dto.getProdStock());
        vo.setProdCategory(dto.getProdCategory());
        vo.setProdDesc(dto.getProdDesc());
        vo.setProdStatus(dto.getProdStatus());

        if(file != null && !file.isEmpty()) {
            try {
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String savedFileName = UUID.randomUUID().toString() + extension;

                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                File dest = new File(dir, savedFileName);
                file.transferTo(dest);

                vo.setProdImg(savedFileName);
            }
            catch(IOException e) {
                e.printStackTrace();
                throw new RuntimeException("상품 수정 중 파일 업로드 오류", e);
            }
        } else {
            ProductVO old = productMapper.selectProductById(id);
            if(old != null) vo.setProdImg(old.getProdImg());
        }

        productMapper.updateProduct(vo);
    }

    private ProductDto.Response toResponse(ProductVO vo) {
        if (vo == null) return null;
        ProductDto.Response dto = new ProductDto.Response();
        dto.setProdId(vo.getProdId());
        dto.setProdName(vo.getProdName());
        dto.setProdPrice(vo.getProdPrice());
        dto.setProdStock(vo.getProdStock());
        dto.setProdCategory(vo.getProdCategory());
        dto.setProdDesc(vo.getProdDesc());
        dto.setProdImg(vo.getProdImg());
        dto.setProdStatus(vo.getProdStatus());
        dto.setRegDate(vo.getRegDate());
        return dto;
    }
}