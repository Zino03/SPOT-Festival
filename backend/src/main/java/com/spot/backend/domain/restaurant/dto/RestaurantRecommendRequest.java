package com.spot.backend.domain.restaurant.dto;

import lombok.Data;
import java.util.List;

@Data
public class RestaurantRecommendRequest {
    private PreferencesDto preferences;
    private List<KakaoPlaceDto> places;

    @Data
    public static class PreferencesDto {
        private String region;
        private String date;
        private String companion;
        private List<String> themes;
    }

    @Data
    public static class KakaoPlaceDto {
        private String id; // 카카오 장소 ID는 문자열
        private String name;
        private String category;
        private String distance;
        private String walk;
        private String address;
        private String phone;
        private boolean isAI; // 프론트엔드로 반환할 때 사용할 AI 1순위 여부
    }
}