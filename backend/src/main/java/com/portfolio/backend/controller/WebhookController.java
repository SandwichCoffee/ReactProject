package com.portfolio.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.portfolio.backend.dto.WebhookDto;
import com.portfolio.backend.service.OrderService;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {
    private final OrderService orderService;

    @PostMapping("simulate")
    public ResponseEntity<String> simulateExternalOrder(@RequestBody WebhookDto dto) {
        try {
            orderService.processWebhookSimulation(dto.getUserId(), dto.getProdId());
            return ResponseEntity.ok("웹훅 시뮬레이션 성공: 재고 차감 및 출고 완료");
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body("웹훅 처리 실패: " + e.getMessage());
        }
    }
}
