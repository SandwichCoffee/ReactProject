package com.portfolio.backend.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecruitVO {
    private int recruitId;
    private String title;
    private String contents;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime regDate;
}
