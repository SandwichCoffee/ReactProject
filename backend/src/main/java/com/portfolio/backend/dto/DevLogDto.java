package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class DevLogDto {

    @Data
    public static class Request {
        @NotBlank(message = "제목은 필수입니다.")
        private String title;

        @NotBlank(message = "내용은 필수입니다.")
        private String content;

        @NotBlank(message = "태그(유형)는 필수입니다.")
        private String type; 
    }

    @Data
    public static class Response {
        private int logId;
        private String title;
        private String content;
        private String type;
        private LocalDateTime regDate;
    }
}
