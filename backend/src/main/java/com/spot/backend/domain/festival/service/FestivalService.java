package com.spot.backend.domain.festival.service;

import com.spot.backend.domain.festival.dto.FestivalRecommendRequest;
import com.spot.backend.domain.festival.dto.FestivalDetailResponse;
import com.spot.backend.domain.festival.entity.Festival;
import com.spot.backend.domain.festival.repository.FestivalRepository;
// TODO: 상혁님이 이전에 만드신 Gemini 연동 서비스의 패키지 경로로 맞춰주세요.
import com.spot.backend.infrastructure.ai.service.GeminiService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final GeminiService geminiService; // 오늘 오전에 연동하신 Gemini API 서비스

    public List<FestivalDetailResponse> recommendByAI(FestivalRecommendRequest request) {

        // 1. DB에서 조건(지역, 날짜)에 맞는 1차 후보군 가져오기
        log.info("AI 축제 추천 요청 - 지역: {}, 날짜: {}", request.getRegion(), request.getDate());
        List<Festival> candidates = festivalRepository.findByRegionAndDateValid(request.getRegion(), request.getDate());

        // 만약 조건에 맞는 축제가 없거나 1개뿐이라면 AI 호출 없이 바로 반환 (비용 및 시간 절감)
        if (candidates.isEmpty() || candidates.size() == 1) {
            log.info("후보군이 1개 이하이므로 AI 호출 생략");
            return candidates.stream().map(FestivalDetailResponse::from).collect(Collectors.toList());
        }

        // 2. AI에게 넘겨줄 프롬프트용 후보 리스트 텍스트 만들기 (예: "1번: 청주 음악제 - 음악과 함께하는...")
        StringBuilder candidateText = new StringBuilder();
        for (Festival f : candidates) {
            candidateText.append(f.getId()).append("번: ").append(f.getName()).append("\n");
        }

        // 3. AI 프롬프트 조립 (동행자와 테마를 바탕으로 랭킹 산정 지시)
        String prompt = """
            너는 여행 큐레이터야. 유저가 [%s]과 함께 [%s] 테마의 여행을 원해.
            아래 제공된 축제 후보들 중에서 유저의 취향에 가장 완벽하게 부합하는 순서대로 랭킹을 매겨줘.
            다른 말은 절대 하지 말고, 가장 추천하는 축제의 '번호(ID)'들만 쉼표로 구분해서 응답해. (예시: 3,1,5,2,4)
            
            [축제 후보]
            %s
            """.formatted(request.getCompanion(), String.join(", ", request.getThemes()), candidateText.toString());

        try {
            // 4. AI 호출하여 정렬된 ID 리스트 응답받기 (예: "3, 1, 5")
            String aiResponse = geminiService.getTravelPlanFromGemini(prompt); // 메서드명은 실제 구현하신 이름으로 변경
            log.info("Gemini AI 응답 순서: {}", aiResponse);

            // 5. AI가 준 ID 순서대로 DB 엔티티를 정렬
            List<Long> rankedIds = Arrays.stream(aiResponse.split(","))
                    .map(String::trim)
                    .map(Long::valueOf)
                    .collect(Collectors.toList());

            // 6. 정렬된 순서대로 DTO 변환 후 프론트엔드로 반환
            return rankedIds.stream()
                    .map(id -> candidates.stream().filter(f -> f.getId().equals(id)).findFirst().orElse(null))
                    .filter(Objects::nonNull) // null 안전하게 필터링
                    .map(FestivalDetailResponse::from)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            // AI 호출 실패 시 (토큰 초과, 서버 에러 등)
            // 로직이 터지지 않도록 기존 DB 조회 순서대로 반환하는 든든한 방어 코드!
            log.error("AI 추천 중 오류 발생, 기본 순서로 반환합니다.", e);
            return candidates.stream().map(FestivalDetailResponse::from).collect(Collectors.toList());
        }
    }
}