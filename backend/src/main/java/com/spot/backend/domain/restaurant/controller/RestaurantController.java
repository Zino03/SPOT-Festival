package com.spot.backend.domain.restaurant.controller;

import com.spot.backend.domain.restaurant.dto.RestaurantRecommendRequest;
import com.spot.backend.domain.restaurant.dto.RestaurantRecommendRequest.KakaoPlaceDto;
import com.spot.backend.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // ✨ 1단계와 동일하게 CORS 허용
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping("/recommend")
    public List<KakaoPlaceDto> recommendRestaurants(@RequestBody RestaurantRecommendRequest request) {
        return restaurantService.recommendByAI(request);
    }
}