package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class RecruitDto {

    @Data
    public static class Request {
        @NotBlank(message = "제목은 필수입니다.")
        private String title;

        @NotBlank(message = "내용은 필수입니다.")
        private String contents;

        private String status;

        private LocalDateTime startDate;
        private LocalDateTime endDate;
    }

    @Data
    public static class Response {
        private int recruitId;
        private String title;
        private String contents;
        private String status;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private LocalDateTime regDate;
    }
}
