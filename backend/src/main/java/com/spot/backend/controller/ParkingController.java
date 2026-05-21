package com.spot.backend.controller;

import com.spot.backend.infrastructure.kakao.service.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;

    // 축제 위치 기준 근처 주차장 조회
    @GetMapping("/nearby")
    public List<Map<String, Object>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng) {
        return parkingService.getNearbyParkings(lat, lng);
    }
}
