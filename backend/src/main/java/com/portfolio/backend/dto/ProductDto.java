package com.portfolio.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class ProductDto {

    @Data
    public static class Request {
        @NotBlank(message = "상품명은 필수입니다.")
        private String prodName;

        @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
        private int prodPrice;

        @Min(value = 0, message = "재고는 0개 이상이어야 합니다.")
        private int prodStock;

        @NotBlank(message = "카테고리는 필수입니다.")
        private String prodCategory;

        private String prodDesc;

        private String prodStatus; // ON_SALE, SOLD_OUT, etc.
    }

    @Data
    public static class Response {
        private int prodId;
        private String prodName;
        private int prodPrice;
        private int prodStock;
        private String prodCategory;
        private String prodDesc;
        private String prodImg;
        private String prodStatus;
        private LocalDateTime regDate;
    }
}
