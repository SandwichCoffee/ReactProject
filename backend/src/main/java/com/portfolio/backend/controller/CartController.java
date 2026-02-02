package com.portfolio.backend.controller;

import com.portfolio.backend.service.CartService;
import com.portfolio.backend.vo.CartVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public List<CartVO> getCartList(@PathVariable int userId) {
        return cartService.getMyCart(userId);
    }

    @PostMapping
    public void addToCart(@RequestBody CartVO cart) {
        cartService.addCart(cart);
    }

    @PutMapping
    public void updateQuantity(@RequestBody CartVO cart) {
        cartService.updateQuantity(cart);
    }

    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable int cartId) {
        cartService.removeCart(cartId);
    }
}
