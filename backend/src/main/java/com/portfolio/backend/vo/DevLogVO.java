package com.portfolio.backend.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DevLogVO {
    private int logId;
    private String title;
    private String content;
    private String type; // FEATURE, BUGFIX, REFACTOR, ETC
    private LocalDateTime regDate;
}
