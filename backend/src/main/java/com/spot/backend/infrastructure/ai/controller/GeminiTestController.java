package com.spot.backend.infrastructure.ai.controller;

import com.spot.backend.infrastructure.ai.service.GeminiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// 프롬프트 날리는 테스트
@RestController
public class GeminiTestController {

    private final GeminiService geminiService;
    public GeminiTestController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }
    // 테스트용 API 주소: http://localhost:8080/api/ai/test?prompt=안녕
    @GetMapping("/api/ai/test")
    public String testGemini(@RequestParam String prompt) {
        return geminiService.getTravelPlanFromGemini(prompt);
    }
}