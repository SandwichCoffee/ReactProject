package com.portfolio.backend.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderVO {
    private int orderId;
    private int userId;
    private String orderNo;
    private int totalAmount;
    private String status;
    private LocalDateTime orderDate;

    // 주문 목록 조회할 때 상세 품목도 같이 보려고 추가
    private List<OrderDetailVO> details;
}