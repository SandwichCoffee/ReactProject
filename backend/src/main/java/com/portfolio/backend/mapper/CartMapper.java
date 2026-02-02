package com.portfolio.backend.mapper;

import com.portfolio.backend.vo.CartVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CartMapper {
    List<CartVO> selectCartList(int userId);
    void addCart(CartVO cart);
    void updateQuantity(CartVO cart);
    void deleteCart(int cartId);
}
