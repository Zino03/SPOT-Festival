package com.spot.backend.domain.planner.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spot.backend.domain.festival.dto.PlannerRequestDto;

import com.spot.backend.domain.planner.entity.Planner;
import com.spot.backend.domain.planner.entity.Timeline;
import com.spot.backend.domain.planner.repository.PlannerRepository;
import com.spot.backend.infrastructure.ai.service.GeminiService;
import com.spot.backend.infrastructure.kakao.service.KakaoPlacesService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service // 비즈니스 로직
// GeminiService, KakaoPlacesService를 받아서 조합
public class TravelPlannerService {

    private final GeminiService geminiService;
    private final KakaoPlacesService kakaoPlacesService;
    private final PlannerRepository plannerRepository;
    private final ObjectMapper objectMapper;

    public TravelPlannerService(GeminiService geminiService, KakaoPlacesService kakaoPlacesService, PlannerRepository plannerRepository) {
        this.geminiService = geminiService;
        this.kakaoPlacesService = kakaoPlacesService;
        this.plannerRepository = plannerRepository;
        this.objectMapper = new ObjectMapper();
    }
    @Transactional
    public String generatePlanner(PlannerRequestDto request, boolean refresh) {
        LocalDate today = LocalDate.now();
        // 1. 강제 새로고침(refresh=true) 요청이 오면 기존 오늘자 캐시를 삭제하여 중복 적재 방지
        if (refresh) {
            plannerRepository.findByFestivalNameAndCreatedAt(request.getFestivalName(), today)
                    .ifPresent(plannerRepository::delete);
        } else {
            // 2. 새로고침이 아니라면 DB를 먼저 조회 (캐시 히트)
            Optional<Planner> cachedPlanner = plannerRepository.findByFestivalNameAndCreatedAt(request.getFestivalName(), today);
            if (cachedPlanner.isPresent()) {
                return convertEntityToJsonString(cachedPlanner.get(), request.getDuration());
            }
        }
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
        // Gemini가 생성한 JSON 결과 문자열
        String jsonResult = geminiService.getTravelPlanFromGemini(prompt);

        // 3. 새로 생성된 AI 플랜을 파싱하여 DB에 저장
        savePlannerToDb(jsonResult, request.getFestivalName(), today);

        // 조립된 프롬프트를 GeminiService로 넘겨서 파싱된 JSON 결과를 받아옵니다.
        return geminiService.getTravelPlanFromGemini(prompt);
    }
    /**
     * ✨ 보조 메서드 1: DB에서 조회한 Entity 구조를 프론트가 원하는 JSON 스트링 포맷으로 역변환
     */
    private String convertEntityToJsonString(Planner planner, String duration) {
        try {
            // DB의 자식 타임라인 리스트를 JSON 구조의 Map 리스트로 매핑
            List<Map<String, String>> timelineMaps = planner.getTimelines().stream()
                    .map(t -> Map.of(
                            "time", t.getTime(),
                            "place", t.getPlace(),
                            "activity", t.getActivity()
                    )).toList();

            // 프론트 UI가 쓰던 출력 포맷 구조 그대로 Map 조립
            Map<String, Object> rootMap = Map.of(
                    "title", planner.getTitle(),
                    "duration", duration,
                    "itinerary", List.of(Map.of(
                            "day", 1,
                            "timeline", timelineMaps
                    ))
            );

            return objectMapper.writeValueAsString(rootMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("캐시 데이터 JSON 변환 실패", e);
        }
    }

    /**
     * ✨ 보조 메서드 2: Gemini JSON 문자열을 파싱해서 1:N 관계의 관계형 DB 엔티티로 저장
     */
    private void savePlannerToDb(String jsonResult, String festivalName, LocalDate today) {
        try {
            JsonNode root = objectMapper.readTree(jsonResult);
            String title = root.path("title").asText();

            // 부모 엔티티 빌드
            Planner planner = Planner.builder()
                    .festivalName(festivalName)
                    .createdAt(today)
                    .title(title)
                    .build();

            // JSON 내부의 itinerary -> timeline 배열 추출
            JsonNode timelineArray = root.path("itinerary").get(0).path("timeline");
            if (timelineArray.isArray()) {
                for (JsonNode node : timelineArray) {
                    Timeline timeline = Timeline.builder()
                            .time(node.path("time").asText())
                            .place(node.path("place").asText())
                            .activity(node.path("activity").asText())
                            .build();

                    // 양방향 편의 메서드로 연관관계 매핑 및 자식 추가
                    planner.addTimeline(timeline);
                }
            }

            plannerRepository.save(planner);
        } catch (Exception e) {
            // JSON 파싱이나 DB 저장 중 예외 발생 시 로그 출력 후 원본 리턴하도록 스킵 (시스템 안정성 방어)
            System.err.println("AI 결과 DB 저장 중 예외 발생: " + e.getMessage());
        }
    }
}