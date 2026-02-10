package com.portfolio.backend.controller;

import com.portfolio.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.portfolio.backend.dto.SalesDto;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(@RequestParam(defaultValue = "daily") String period) {
        Map<String, Object> stats = new HashMap<>();

        stats.put("chartData", orderService.getSalesStats(period));
        stats.put("totalRevenue", orderService.getTotalRevenue());

        return stats;
    }

    @PostMapping
    public void createOrder(@RequestBody UserRequest request) {
        orderService.placeOrder(request.getUserId());
    }

    @lombok.Data
    static class UserRequest {
        private String userId;
    }
}
