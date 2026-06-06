package com.spot.backend.domain.restaurant.service;

import com.spot.backend.domain.restaurant.dto.RestaurantRecommendRequest;
import com.spot.backend.domain.restaurant.dto.RestaurantRecommendRequest.KakaoPlaceDto;
import com.spot.backend.infrastructure.ai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final GeminiService geminiService;

    public List<KakaoPlaceDto> recommendByAI(RestaurantRecommendRequest request) {

        List<KakaoPlaceDto> candidates = request.getPlaces();
        log.info("AI 맛집 정렬 요청 - 후보 개수: {}개", candidates.size());

        // 1. 후보가 없거나 1개면 AI 호출 없이 바로 반환
        if (candidates == null || candidates.size() <= 1) {
            return candidates;
        }

        // 2. AI에게 넘겨줄 프롬프트용 맛집 리스트 텍스트 만들기 (카테고리 포함)
        StringBuilder candidateText = new StringBuilder();
        for (KakaoPlaceDto p : candidates) {
            candidateText.append(p.getId()).append("번: ").append(p.getName())
                    .append(" (").append(p.getCategory()).append(")\n");
        }

        // 3. AI 프롬프트 조립
        String themes = request.getPreferences().getThemes() != null
                ? String.join(", ", request.getPreferences().getThemes()) : "기본";

        String prompt = """
            너는 여행 큐레이터야. 유저가 [%s]과 함께 [%s] 테마의 식사(또는 디저트)를 원해.
            아래 제공된 주변 식당 후보들 중에서 유저의 취향에 가장 완벽하게 부합하는 순서대로 랭킹을 매겨줘.
            다른 말은 절대 하지 말고, 가장 추천하는 식당의 '번호(ID)'들만 쉼표로 구분해서 응답해. (예시: 12345,67890,11122)
            
            [식당 후보]
            %s
            """.formatted(request.getPreferences().getCompanion(), themes, candidateText.toString());

        try {
            // 4. AI 호출 및 응답 파싱
            String aiResponse = geminiService.getTravelPlanFromGemini(prompt);
            log.info("Gemini AI 맛집 정렬 응답: {}", aiResponse);

            List<String> rankedIds = Arrays.stream(aiResponse.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());

            // 5. AI가 준 ID 순서대로 프론트엔드가 준 리스트 재정렬
            List<KakaoPlaceDto> sortedPlaces = rankedIds.stream()
                    .map(id -> candidates.stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // 6. 혹시 AI가 응답에서 누락시킨 장소가 있다면 맨 뒤에 붙이기
            candidates.stream()
                    .filter(p -> !rankedIds.contains(p.getId()))
                    .forEach(sortedPlaces::add);

            // 7. 정렬된 리스트의 첫 번째 항목에만 '✦ AI 1순위' 뱃지(isAI = true) 달아주기
            for (int i = 0; i < sortedPlaces.size(); i++) {
                sortedPlaces.get(i).setAI(i == 0);
            }

            return sortedPlaces;

        } catch (Exception e) {
            log.error("AI 맛집 정렬 중 오류 발생, 기존 거리순으로 반환합니다.", e);
            // 에러 시 0번째에만 뱃지를 달아 기존대로 리턴
            candidates.get(0).setAI(true);
            return candidates;
        }
    }
}