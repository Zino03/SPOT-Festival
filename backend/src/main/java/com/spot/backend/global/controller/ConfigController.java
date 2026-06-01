package com.spot.backend.global.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 카카오맵 API
@RestController
@RequestMapping("/api/config")
public class ConfigController {
    // 보안을 위해 application.yaml에서 백엔드가 읽고, 프론트에 전달하는 구조
    @Value("${kakao.javascript-key:}")
    private String kakaoMapKey;

    @GetMapping("/kakao-key")
    public Map<String, String> getKakaoKey() {
        return Map.of("key", kakaoMapKey);
    }
}
