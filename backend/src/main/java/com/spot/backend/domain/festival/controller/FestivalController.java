package com.spot.backend.domain.festival.controller;

import com.spot.backend.domain.festival.dto.FestivalDetailResponse;
import com.spot.backend.domain.festival.service.FestivalService;
import com.spot.backend.domain.festival.entity.Festival;
import com.spot.backend.domain.festival.repository.FestivalRepository;
import com.spot.backend.domain.festival.dto.FestivalRecommendRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController // 모든 메서드가 JSON을 반환하는 컨트롤러
@RequestMapping("/api/festivals") // 엔드포인트 명시
@RequiredArgsConstructor // final 필드를 받는 생성자 자동 생성
@CrossOrigin(origins = "http://localhost:5173")
// -> Spring이 그 생성자로 FestivalRepository 주입
public class FestivalController {
    private final FestivalRepository festivalRepository;
    private final FestivalService festivalService;

    // 홈 화면 통계 카드
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());
        return Map.of(
            "totalCount", festivalRepository.count(), // 전체 축제수
            "liveCount",  festivalRepository.countLiveToday(today), // 오늘 진행 중인 축제수
            "monthCount", festivalRepository.countThisMonth(monthStart, monthEnd) // 이번 달 축제 수
        );
    }

    // 검색 API
    @GetMapping("/search")
    public List<FestivalDetailResponse> search(@RequestParam String q) {
        if (q == null || q.isBlank()) return List.of(); // 빈 문자열 반환 시 빈 배열 반환
        // 앞뒤 공백 제거하고 최대 50개까지만 반환
        return festivalRepository.searchByKeyword(q.trim(), PageRequest.of(0, 50))
                .stream().map(FestivalDetailResponse::new).toList();
    }

    /* Trending 기능 주석 처리
    // 홈 화면 Trending
    @GetMapping("/trending")
    public List<Festival> getTrendingFestivals() {
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);

        return festivalRepository.findTop8Trending(today, nextWeek);
    }
    */
   
    @GetMapping("/calendar")
    public ResponseEntity<List<FestivalDetailResponse>> getFestivalsByCalendarDate(@RequestParam("date") String dateStr) {
        // 프론트엔드에서 넘어온 문자열(예: "2026-06-08")을 자바 날짜 객체로 변환
        LocalDate targetDate = LocalDate.parse(dateStr);
        // Service 로직 호출하여 결과 반환
        List<FestivalDetailResponse> response = festivalService.getFestivalsByDate(targetDate);
        return ResponseEntity.ok(response);
    }

    // 지역 영문 매핑
    private static final Map<String, String> REGION_KEYWORD = Map.ofEntries(
        Map.entry("seoul", "서울"),
        Map.entry("gyeonggi", "경기"),
        Map.entry("incheon", "인천"),
        Map.entry("gangwon", "강원"),
        Map.entry("chungnam", "충청남도"),
        Map.entry("chungbuk", "충청북도"),
        Map.entry("daejeon", "대전"),
        Map.entry("sejong", "세종"),
        Map.entry("jeonbuk", "전라북도"),
        Map.entry("jeonnam", "전라남도"),
        Map.entry("gwangju", "광주"),
        Map.entry("gyeongbuk", "경상북도"),
        Map.entry("gyeongnam", "경상남도"),
        Map.entry("daegu", "대구"),
        Map.entry("ulsan", "울산"),
        Map.entry("busan", "부산"),
        Map.entry("jeju", "제주")
    );

    // 지도 각 지역 표시할 축제 수 API
    @GetMapping("/region-counts")
    public List<Map<String, Object>> getRegionCounts() {
        return REGION_KEYWORD.entrySet().stream()
            .map(e -> Map.<String, Object>of(
                "regionId", e.getKey(),
                "count", festivalRepository.countByRegionKeyword(e.getValue())
            ))
            .toList();
    }

   // 지역별 축제 목록 API
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<FestivalDetailResponse>> getFestivalsByRegion(@PathVariable String regionId) {
        String keyword = REGION_KEYWORD.get(regionId.toLowerCase()); // 대소문자 구분 x
        if (keyword == null) return ResponseEntity.badRequest().build(); // 없는 지역이면 400 에러
        List<FestivalDetailResponse> result = festivalRepository.findByRegionKeyword(keyword)
            .stream()
            .map(FestivalDetailResponse::new)
            .toList();
        return ResponseEntity.ok(result);
    }

     // 축제 상세 페이지 API 
    @GetMapping("/{id}")
    public ResponseEntity<FestivalDetailResponse> getFestivalDetail(@PathVariable Long id) {
        return festivalRepository.findById(id)
            .map(festival -> {
                festival.incrementViewCount(); // 조회 시 viewCount + 1
                festivalRepository.save(festival);
                return ResponseEntity.ok(new FestivalDetailResponse(festival));
            })
            .orElse(ResponseEntity.notFound().build()); // 없는 ID면 404
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommendFestivals(@RequestBody FestivalRecommendRequest request) {
        // 프론트엔드의 취향 데이터를 서비스 계층으로 전달
        return ResponseEntity.ok(festivalService.recommendByAI(request));
    }
}