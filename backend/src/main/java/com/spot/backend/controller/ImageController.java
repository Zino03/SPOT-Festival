package com.spot.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageController {

    @Value("${unsplash.access-key}")
    private String accessKey;

    private final RestClient   restClient = RestClient.create();
    private final ObjectMapper mapper     = new ObjectMapper();

    // 메모리 캐시
    private final Map<String, String>       photoCache  = new ConcurrentHashMap<>();
    private final Map<String, List<String>> photosCache = new ConcurrentHashMap<>();

    // 캐시 파일 경로 (백엔드 루트 기준)
    private static final String CACHE_FILE = "image-cache.json";

    @PostConstruct
    @SuppressWarnings("unchecked")
    void loadCache() {
        File file = new File(CACHE_FILE);
        if (!file.exists()) return;
        try {
            Map<String, Object> saved = mapper.readValue(file, new TypeReference<>() {});
            Map<String, String> photos = (Map<String, String>) saved.getOrDefault("photo", Map.of());
            Map<String, List<String>> photosList = (Map<String, List<String>>) saved.getOrDefault("photos", Map.of());
            photoCache.putAll(photos);
            photosCache.putAll(photosList);
            System.out.println("[ImageController] 캐시 로드 완료: photo=" + photos.size() + ", photos=" + photosList.size());
        } catch (Exception e) {
            System.err.println("[ImageController] 캐시 파일 로드 실패: " + e.getMessage());
        }
    }

    void saveCache() {
        try {
            mapper.writeValue(new File(CACHE_FILE), Map.of("photo", photoCache, "photos", photosCache));
        } catch (Exception e) {
            System.err.println("[ImageController] 캐시 저장 실패: " + e.getMessage());
        }
    }

    /** 단일 이미지 URL */
    @SuppressWarnings("unchecked")
    @GetMapping("/photo")
    public ResponseEntity<Map<String, String>> getPhoto(
            @RequestParam String query,
            @RequestParam(defaultValue = "landscape") String orientation) {

        String cacheKey = query + ":" + orientation;
        if (photoCache.containsKey(cacheKey)) {
            return ResponseEntity.ok(Map.of("url", photoCache.get(cacheKey)));
        }

        try {
            var uri = UriComponentsBuilder.fromUriString("https://api.unsplash.com/photos/random")
                    .queryParam("query", query)
                    .queryParam("orientation", orientation)
                    .build().toUri();

            Map<String, Object> photo = restClient.get()
                    .uri(uri)
                    .header("Authorization", "Client-ID " + accessKey)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (photo == null) return ResponseEntity.noContent().build();

            Map<String, String> urls = (Map<String, String>) photo.get("urls");
            String url = urls != null ? urls.get("regular") : null;
            if (url == null) return ResponseEntity.noContent().build();

            photoCache.put(cacheKey, url);
            saveCache();
            return ResponseEntity.ok(Map.of("url", url));

        } catch (Exception e) {
            System.err.println("[ImageController] /photo 에러: " + e.getMessage());
            return ResponseEntity.status(502).build();
        }
    }

    /** 여러 이미지 URL 목록 (최대 30장) */
    @SuppressWarnings("unchecked")
    @GetMapping("/photos")
    public ResponseEntity<List<String>> getPhotos(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int count,
            @RequestParam(defaultValue = "landscape") String orientation) {

        int safeCount = Math.min(count, 30);
        String cacheKey = query + ":" + safeCount + ":" + orientation;

        if (photosCache.containsKey(cacheKey)) {
            return ResponseEntity.ok(photosCache.get(cacheKey));
        }

        try {
            var uri = UriComponentsBuilder.fromUriString("https://api.unsplash.com/photos/random")
                    .queryParam("query", query)
                    .queryParam("count", safeCount)
                    .queryParam("orientation", orientation)
                    .build().toUri();

            List<Map<String, Object>> photos = restClient.get()
                    .uri(uri)
                    .header("Authorization", "Client-ID " + accessKey)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (photos == null) return ResponseEntity.ok(List.of());

            List<String> urlList = photos.stream()
                    .map(p -> {
                        Map<String, String> urls = (Map<String, String>) p.get("urls");
                        return urls != null ? urls.get("regular") : null;
                    })
                    .filter(Objects::nonNull)
                    .toList();

            photosCache.put(cacheKey, urlList);
            saveCache();
            return ResponseEntity.ok(urlList);

        } catch (Exception e) {
            System.err.println("[ImageController] /photos 에러: " + e.getMessage());
            return ResponseEntity.status(502).build();
        }
    }
}
