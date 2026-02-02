package com.portfolio.backend.mapper;

import com.portfolio.backend.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.multipart.MultipartFile;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {
    List<ProductVO> selectProductList(@Param("limit") int limit, @Param("offset") int offset);
    int selectProductCount();
    ProductVO selectProductById(int prodId);
    void insertProduct(ProductVO product);
    void deleteProduct(int prodId);
    void updateProduct(ProductVO vo);
    int decreaseStock(@Param("prodId") int prodId, @Param("quantity") int quantity);
}
