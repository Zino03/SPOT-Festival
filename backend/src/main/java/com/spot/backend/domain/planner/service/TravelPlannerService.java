package com.spot.backend.domain.planner.service;

import com.spot.backend.domain.festival.dto.PlannerRequestDto;

import com.spot.backend.infrastructure.ai.service.GeminiService;
import com.spot.backend.infrastructure.kakao.service.KakaoPlacesService;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service // 비즈니스 로직
// GeminiService, KakaoPlacesService를 받아서 조합
public class TravelPlannerService {

    private final GeminiService geminiService;
    private final KakaoPlacesService kakaoPlacesService;

    public TravelPlannerService(GeminiService geminiService, KakaoPlacesService kakaoPlacesService) {
        this.geminiService = geminiService;
        this.kakaoPlacesService = kakaoPlacesService;
    }

    public String generatePlanner(PlannerRequestDto request) {
        //임시 연결
        //List<String> parkingLots = Arrays.asList("제1 공영 주차장", "임시 잔디 주차장");
        List<Map<String, Object>> parkingDataList = kakaoPlacesService.getNearbyParkings(request.getLatitude(), request.getLongitude());

        // Map 덩어리에서 주차장 이름만 뽑아 List<String>으로 변환
        List<String> parkingLots = parkingDataList.stream()
                .map(parking -> (String) parking.get("place_name")) // 카카오 API의 장소명 키값
                .limit(3) // AI 프롬프트를 위해 제일 가까운 주차장 상위 3개만 자르기 (옵션)
                .toList();

        if (parkingLots.isEmpty()) {
            parkingLots = Arrays.asList("축제장 인근 유료 및 공영 주차장");
        }

        // 맛집 (카카오 FD6)
        List<String> restaurants = kakaoPlacesService.getNearbyPlaces(request.getLatitude(), request.getLongitude(), "FD6", 5)
                .stream()
                .map(p -> (String) p.get("place_name"))
                .limit(3)
                .toList();
        if (restaurants.isEmpty()) restaurants = Arrays.asList("축제장 인근 음식점");

        // 카페 (카카오 CE7)
        List<String> cafes = kakaoPlacesService.getNearbyPlaces(request.getLatitude(), request.getLongitude(), "CE7", 5)
                .stream()
                .map(p -> (String) p.get("place_name"))
                .limit(2)
                .toList();
        if (cafes.isEmpty()) cafes = Arrays.asList("축제장 인근 카페");

        // 테마 리스트를 하나의 문자열로 변환 (예: "조용한, 힐링")
        String themeString = String.join(", ", request.getThemes());

        // Gemini에게 보낼 완벽한 프롬프트 조립 (Java 15+ Text Block 사용)
        String prompt = """
            너는 코스 기획 전문가야. 유저는 [%s]과 함께 [%s] 분위기의 [%s] 여행을 원해.
            제공된 장소 데이터를 조합해서 유저의 성향에 딱 맞는 시간대별 여행 일정표를 만들어줘.
            다른 잡담은 절대 하지 말고 오직 아래 JSON 포맷으로만 응답해.

            [장소 데이터]
            - 메인 축제: %s
            - 주차장 후보: %s
            - 맛집 후보: %s
            - 카페 후보: %s

            [출력 JSON 포맷]
            {
              "title": "플래너 제목",
              "duration": "%s",
              "itinerary": [
                {
                  "day": 1,
                  "timeline": [
                    {"time": "11:00", "place": "장소명", "activity": "행동 및 추천 이유 설명"}
                  ]
                }
              ]
            }
            """.formatted(
                request.getCompanion(),
                themeString,
                request.getDuration(),
                request.getFestivalName(),
                String.join(", ", parkingLots),
                String.join(", ", restaurants),
                String.join(", ", cafes),
                request.getDuration()
        );

        // 조립된 프롬프트를 GeminiService로 넘겨서 파싱된 JSON 결과를 받아옵니다.
        return geminiService.getTravelPlanFromGemini(prompt);
    }
}