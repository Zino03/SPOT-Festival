package com.spot.backend.domain.planner.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
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
    public Map<String, Object> generatePlanner(PlannerRequestDto request, boolean refresh) {
        LocalDate today = LocalDate.now();
        boolean isCustomPlan = request.getRestaurants() != null && !request.getRestaurants().isEmpty();
        // Trending 모드일 때만 DB 캐시 조회 및 삭제 적용 (오염 방지)
        if (!isCustomPlan) {
            if (refresh) {
                plannerRepository.findByFestivalNameAndCreatedAt(request.getFestivalName(), today)
                        .ifPresent(plannerRepository::delete);
            } else {
                Optional<Planner> cached = plannerRepository.findByFestivalNameAndCreatedAt(request.getFestivalName(), today);
                if (cached.isPresent()) {
                    return convertEntityToMap(cached.get(), request.getDuration());
                }
            }
        }

        String parkingName;
        String lunchName;
        String dinnerName;
        String cafeName;

        // 모드에 따른 데이터 주입 (투트랙)
        if (isCustomPlan) {
            // [Builder 모드] 유저가 선택한 장소 그대로 사용 (환각 방지)
            parkingName = request.getParking() != null ? request.getParking().getName() : "인근 주차장";
            cafeName = request.getCafe() != null ? request.getCafe().getName() : "인근 카페";
            List<PlannerRequestDto.PlaceDto> rests = request.getRestaurants();
            lunchName = rests.get(0).getName();
            dinnerName = (rests.size() > 1) ? rests.get(1).getName() : "자유 저녁 식사";
        } else {
            // [Trending 모드] 카카오 API로 자동 검색 (메인 페이지용)
            List<Map<String, Object>> parkingData = kakaoPlacesService.getNearbyParkings(request.getLatitude(), request.getLongitude());
            parkingName = parkingData.isEmpty() ? "공영 주차장" : (String) parkingData.get(0).get("place_name");

            List<Map<String, Object>> cafes = kakaoPlacesService.getNearbyPlaces(request.getLatitude(), request.getLongitude(), "CE7", 2);
            cafeName = cafes.isEmpty() ? "인근 감성 카페" : (String) cafes.get(0).get("place_name");

            List<Map<String, Object>> rests = kakaoPlacesService.getNearbyPlaces(request.getLatitude(), request.getLongitude(), "FD6", 5);
            lunchName = rests.isEmpty() ? "로컬 맛집" : (String) rests.get(0).get("place_name");
            dinnerName = rests.size() > 1 ? (String) rests.get(1).get("place_name") : "분위기 좋은 저녁 식당";
        }

        String themeString = (request.getThemes() != null && !request.getThemes().isEmpty())
                ? String.join(", ", request.getThemes()) : "자유로운";

        String prompt = """
            너는 코스 기획 전문가야. 유저는 [%s]과 함께 [%s] 일정으로 [%s] 분위기의 여행을 원해.
            아래 [장소 데이터]만 사용하여 동선과 시간에 맞는 완벽한 일정표를 만들어줘.
            다른 잡담은 절대 하지 말고 오직 아래 JSON 포맷으로만 응답해.

            🚨 [절대 지켜야 할 강력한 제약 조건]
            1. 환각 금지: 제공된 장소 외에 네가 임의로 새로운 식당이나 카페를 절대 지어내지 마라.
            2. 식사 분배: 반드시 아래 제공된 '점심 식당'은 점심 시간에, '저녁 식당'은 저녁 시간에 배치해라.
            3. 일정의 시작은 주차장에 주차하는 것으로 시작하고, 메인 축제 일정을 하이라이트로 넣어라.

            [장소 데이터]
            - 메인 축제: %s
            - 시작 주차장: %s
            - 점심 식당: %s
            - 저녁 식당: %s
            - 방문할 카페: %s

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
                request.getCompanion() != null ? request.getCompanion() : "친구",
                request.getDuration() != null ? request.getDuration() : "당일치기",
                themeString,
                request.getFestivalName(),
                parkingName,
                lunchName,
                dinnerName,
                cafeName,
                request.getDuration() != null ? request.getDuration() : "당일치기"
        );

        String jsonResult = geminiService.getTravelPlanFromGemini(prompt);

        // Trending 모드일 때만 DB에 저장 (개인 커스텀 일정은 저장 안 함)
        if (!isCustomPlan) {
            savePlannerToDb(jsonResult, request.getFestivalName(), today);
        }

        try {
            return objectMapper.readValue(jsonResult, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Gemini 응답 JSON 파싱 실패", e);
        }
    }

    /**
     * 보조 메서드 1: DB 캐시 Entity를 프론트가 원하는 Map 구조로 변환
     * String을 거치지 않고 바로 Map으로 조립해 직렬화 오버헤드를 줄임
     */
    private Map<String, Object> convertEntityToMap(Planner planner, String duration) {
        List<Map<String, String>> timelineMaps = planner.getTimelines().stream()
                .map(t -> Map.of(
                        "time", t.getTime(),
                        "place", t.getPlace(),
                        "activity", t.getActivity()
                )).toList();

        return Map.of(
                "title", planner.getTitle(),
                "duration", duration,
                "itinerary", List.of(Map.of(
                        "day", 1,
                        "timeline", timelineMaps
                ))
        );
    }

    /**
     * 보조 메서드 2: Gemini JSON 문자열을 파싱해서 1:N 관계의 관계형 DB 엔티티로 저장
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