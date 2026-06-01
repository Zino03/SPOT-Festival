package com.spot.backend.global.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// 서버 살아있는지 확인하는 용도
@RestController
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "SPOT Backend is running!";
    }
}