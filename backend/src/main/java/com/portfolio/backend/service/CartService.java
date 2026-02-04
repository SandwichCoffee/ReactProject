package com.portfolio.backend.service;

import com.portfolio.backend.mapper.CartMapper;
import com.portfolio.backend.vo.CartVO;
import com.portfolio.backend.dto.CartDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartMapper cartMapper;

    public List<CartDto.Response> getMyCart(String userId) {
        return cartMapper.selectCartList(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void addCart(CartDto.Request dto) {
        CartVO vo = new CartVO();
        vo.setUserId(dto.getUserId());
        vo.setProdId(dto.getProdId());
        vo.setQuantity(dto.getQuantity());
        
        cartMapper.addCart(vo);
    }

    public void updateQuantity(CartDto.Request dto) {
        CartVO vo = new CartVO();
        if(dto.getCartId() != null) vo.setCartId(dto.getCartId());
        vo.setUserId(dto.getUserId());
        vo.setProdId(dto.getProdId());
        vo.setQuantity(dto.getQuantity());
        
        cartMapper.updateQuantity(vo);
    }
    
    // ... removeCart(int cartId) remains same as it takes ID

    private CartDto.Response toResponse(CartVO vo) {
        if (vo == null) return null;
        CartDto.Response response = new CartDto.Response();
        response.setCartId(vo.getCartId());
        response.setUserId(vo.getUserId());
        response.setProdId(vo.getProdId());
        response.setQuantity(vo.getQuantity());
        response.setProdName(vo.getProdName());
        response.setProdImg(vo.getProdImg());
        response.setProdPrice(vo.getProdPrice());
        return response;
    }

    public void removeCart(int cartId) {
        cartMapper.deleteCart(cartId);
    }
}
