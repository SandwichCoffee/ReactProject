package com.portfolio.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 브라우저에서 /images/로 시작하는 주소를 요청하면
        // 실제 로컬 폴더(uploadDir)를 연결해준다.
        registry.addResourceHandler("/images/**").addResourceLocations("file:///" + uploadDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                  // 모든 주소에 대해서
                .allowedOrigins("http://localhost:5173") // 이 주소의 허락을 받음
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowCredentials(true)             // 쿠키/인증 정보 포함 허용
                .maxAge(3600);                      // 1시간 동안 검사 결과 캐시
    }
}
