package com.portfolio.backend.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserVO {
    private String userId; // DB: user_id -> Java: userId 자동 매핑
    private String userName;
    private String password;
    private String email;
    private String role;
    private String status;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
}
