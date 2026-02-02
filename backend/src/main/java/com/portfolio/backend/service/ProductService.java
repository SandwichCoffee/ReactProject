package com.portfolio.backend.service;

import com.portfolio.backend.mapper.ProductMapper;
import com.portfolio.backend.vo.ProductVO;
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

    public java.util.Map<String, Object> getProductList(int page, int size) {
        int offset = (page - 1) * size;
        List<ProductVO> list = productMapper.selectProductList(size, offset);
        int total = productMapper.selectProductCount();
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("list", list);
        response.put("total", total);
        
        return response;
    }

    public ProductVO getProduct(int prodId) {
        return productMapper.selectProductById(prodId);
    }

    public void registerProduct(ProductVO vo, MultipartFile file) {
        if(file != null && !file.isEmpty()) {
            try {
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String savedFileName = UUID.randomUUID().toString() + extension;

                File dest = new File(uploadDir + savedFileName);
                file.transferTo(dest);
                vo.setProdImg(savedFileName);
            }
            catch(IOException e) {
                e.printStackTrace();
            }
        }

        productMapper.insertProduct(vo);
    }

    public void deleteProduct(int prodId) {
        productMapper.deleteProduct(prodId);
    }

    public void updateProduct(ProductVO vo, MultipartFile file) {
        if(file != null && !file.isEmpty()) {
            try {
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String savedFileName = UUID.randomUUID().toString() + extension;

                File dest = new File(uploadDir + savedFileName);
                file.transferTo(dest);

                vo.setProdImg(savedFileName);
            }
            catch(IOException e) {
                e.printStackTrace();

                throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.", e);
            }
        }

        productMapper.updateProduct(vo);
    }
}
