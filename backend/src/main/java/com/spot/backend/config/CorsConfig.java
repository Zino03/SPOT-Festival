package com.spot.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


// proxy 우회(CORS 에러 처리)
// localhost:5173 -> localhost:8080으로 요청
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // /api로 시작하는 모든 엔드포인트에 적용
                .allowedOrigins("http://localhost:5173") // 이 주소에서 오는 요청만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // 허용할 메소드
                .allowedHeaders("*"); // 모든 헤더 허용
    }
}