package com.portfolio.backend.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProductVO {
    private int prodId;          // PK: int로 변경
    private String prodName;
    private int prodPrice;
    private int prodStock;
    private String prodCategory;
    private String prodDesc;
    private String prodImg;      // 이미지 파일명
    private String prodStatus;
    private LocalDateTime regDate;
}
