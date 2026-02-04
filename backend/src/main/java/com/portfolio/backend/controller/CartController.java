package com.portfolio.backend.controller;

import com.portfolio.backend.service.CartService;
import com.portfolio.backend.dto.CartDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public List<CartDto.Response> getCartList(@PathVariable String userId) {
        return cartService.getMyCart(userId);
    }

    @PostMapping
    public void addToCart(@RequestBody @Valid CartDto.Request dto) {
        cartService.addCart(dto);
    }

    @PutMapping
    public void updateQuantity(@RequestBody @Valid CartDto.Request dto) {
        cartService.updateQuantity(dto);
    }

    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable int cartId) {
        cartService.removeCart(cartId);
    }
}
