package com.spot.backend.domain.planner.controller;

import com.spot.backend.domain.festival.dto.PlannerRequestDto;
import com.spot.backend.domain.planner.service.TravelPlannerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/planner")
public class PlannerController {

    private final TravelPlannerService travelPlannerService;

    public PlannerController(TravelPlannerService travelPlannerService) {
        this.travelPlannerService = travelPlannerService;
    }

    @PostMapping("/generate")
    public String generateTravelPlan(@RequestBody PlannerRequestDto request) {
        // 프론트엔드에서 넘어온 JSON 요청을 받아 AI 플래너 서비스로 전달 (POST)
        return travelPlannerService.generatePlanner(request);
    }
}