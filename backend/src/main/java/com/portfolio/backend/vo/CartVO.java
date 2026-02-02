package com.portfolio.backend.vo;

import lombok.Data;

@Data
public class CartVO {
    private int cartId;
    private int userId;
    private int prodId;
    private int quantity;

    // 조인을 위해 추가한 필드 (DB 테이블엔 없지만 화면엔 필요함)
    private String prodName;
    private String prodImg;
    private int prodPrice;
}
