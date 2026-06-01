package com.spot.backend.global.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "http://localhost:5173")
public class ConfigController {

    @Value("${kakao.javascript-key:}")
    private String kakaoMapKey;

    @GetMapping("/kakao-key")
    public Map<String, String> getKakaoKey() {
        return Map.of("key", kakaoMapKey);
    }
}
