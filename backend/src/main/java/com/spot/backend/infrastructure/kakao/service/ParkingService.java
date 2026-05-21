package com.spot.backend.infrastructure.kakao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ParkingService {

    @Value("${kakao.rest-api-key}")
    private String kakaoApiKey;

    private final RestClient restClient = RestClient.create();

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getNearbyParkings(double lat, double lng) {

        Map<String, Object> response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("dapi.kakao.com")
                        .path("/v2/local/search/category.json")
                        .queryParam("category_group_code", "PK6")
                        .queryParam("y", lat)
                        .queryParam("x", lng)
                        .queryParam("radius", 2000)
                        .queryParam("sort", "distance")
                        .queryParam("size", 15)
                        .build())
                .header("Authorization", "KakaoAK " + kakaoApiKey)
                .retrieve()
                .body(Map.class);

        if (response == null) return Collections.emptyList();

        return (List<Map<String, Object>>) response.get("documents");
    }
}
