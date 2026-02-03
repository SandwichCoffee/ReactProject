package com.portfolio.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class CartDto {

    @Data
    public static class Request {
        @NotNull(message = "사용자 ID는 필수입니다.")
        private Integer userId;

        @NotNull(message = "상품 ID는 필수입니다.")
        private Integer prodId;

        @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
        private int quantity;
        
        private Integer cartId;
    }

    @Data
    public static class Response {
        private int cartId;
        private int userId;
        private int prodId;
        private int quantity;
        private String prodName;
        private String prodImg;
        private int prodPrice;
    }
}
