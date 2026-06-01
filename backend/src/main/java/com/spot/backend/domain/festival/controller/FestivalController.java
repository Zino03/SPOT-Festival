package com.spot.backend.domain.festival.controller;

import com.spot.backend.domain.festival.dto.FestivalDetailResponse;
import com.spot.backend.domain.festival.entity.Festival;
import com.spot.backend.domain.festival.repository.FestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FestivalController {

    private final FestivalRepository festivalRepository;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());
        return Map.of(
            "totalCount", festivalRepository.count(),
            "liveCount",  festivalRepository.countLiveToday(today),
            "monthCount", festivalRepository.countThisMonth(monthStart, monthEnd)
        );
    }

    @GetMapping("/search")
    public List<FestivalDetailResponse> search(@RequestParam String q) {
        if (q == null || q.isBlank()) return List.of();
        return festivalRepository.searchByKeyword(q.trim(), PageRequest.of(0, 50))
                .stream().map(FestivalDetailResponse::new).toList();
    }

    @GetMapping("/trending")
    public List<Festival> getTrendingFestivals() {
        return festivalRepository.findTop8Trending(LocalDate.now());
    }

    private static final Map<String, String> REGION_KEYWORD = Map.ofEntries(
        Map.entry("seoul",     "서울"),
        Map.entry("gyeonggi",  "경기"),
        Map.entry("incheon",   "인천"),
        Map.entry("gangwon",   "강원"),
        Map.entry("chungnam",  "충청남도"),
        Map.entry("chungbuk",  "충청북도"),
        Map.entry("daejeon",   "대전"),
        Map.entry("sejong",    "세종"),
        Map.entry("jeonbuk",   "전라북도"),
        Map.entry("jeonnam",   "전라남도"),
        Map.entry("gwangju",   "광주"),
        Map.entry("gyeongbuk", "경상북도"),
        Map.entry("gyeongnam", "경상남도"),
        Map.entry("daegu",     "대구"),
        Map.entry("ulsan",     "울산"),
        Map.entry("busan",     "부산"),
        Map.entry("jeju",      "제주")
    );

    @GetMapping("/region-counts")
    public List<Map<String, Object>> getRegionCounts() {
        return REGION_KEYWORD.entrySet().stream()
                .map(e -> Map.<String, Object>of(
                        "regionId", e.getKey(),
                        "count",    festivalRepository.countByRegionKeyword(e.getValue())
                ))
                .toList();
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<FestivalDetailResponse>> getFestivalsByRegion(@PathVariable String regionId) {
        String keyword = REGION_KEYWORD.get(regionId.toLowerCase());
        if (keyword == null) return ResponseEntity.badRequest().build();
        List<FestivalDetailResponse> result = festivalRepository.findByRegionKeyword(keyword)
                .stream()
                .map(FestivalDetailResponse::new)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FestivalDetailResponse> getFestivalDetail(@PathVariable Long id) {
        return festivalRepository.findById(id)
                .map(festival -> {
                    festival.incrementViewCount();
                    festivalRepository.save(festival);
                    return ResponseEntity.ok(new FestivalDetailResponse(festival));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}