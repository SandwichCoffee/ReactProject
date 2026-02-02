package com.portfolio.backend.vo;

import lombok.Data;

@Data
public class OrderDetailVO {
    private int detailId;
    private int orderId;
    private int prodId;
    private int price;
    private int quantity;

    // 화면 표시용
    private String prodName;
}