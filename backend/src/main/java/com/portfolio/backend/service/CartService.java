package com.portfolio.backend.service;

import com.portfolio.backend.mapper.CartMapper;
import com.portfolio.backend.vo.CartVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartMapper cartMapper;

    public List<CartVO> getMyCart(int userId) {
        return cartMapper.selectCartList(userId);
    }

    public void addCart(CartVO cart) {
        cartMapper.addCart(cart);
    }

    public void updateQuantity(CartVO cart) {
        cartMapper.updateQuantity(cart);
    }

    public void removeCart(int cartId) {
        cartMapper.deleteCart(cartId);
    }
}
