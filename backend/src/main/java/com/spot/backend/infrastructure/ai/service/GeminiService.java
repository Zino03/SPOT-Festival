package com.spot.backend.infrastructure.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

// JSON 파싱을 위해 추가된 2줄
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {
    // 둘 다 application.yaml에서 가져옴
    @Value("${gemini.api.new-key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // JSON 껍데기를 벗겨줄 도구 생성
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getTravelPlanFromGemini(String prompt) {
        String requestUrl = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = """
            {
              "contents": [{
                "parts": [{"text": "%s"}]
              }]
            }
            """.formatted(prompt.replace("\"", "\\\"")); // "" 이스케이프

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // 1. 구글 서버에서 JSON 응답을 받기
        String rawResponse = restTemplate.postForObject(requestUrl, entity, String.class);

        try {
            // 2. 진짜 텍스트 찾기
            // (candidates[0] -> content -> parts[0] -> text)
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            JsonNode textNode = rootNode.path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text");

            // 3. 마크다운 코드블록 제거 후 순수 JSON 문자열만 리턴
            // Gemini가 프롬프트를 무시하고 ```json ... ``` 형태로 감싸서 줄 때가 있음
            String text = textNode.asText();
            text = text.replaceAll("(?s)```json\\s*", "").replaceAll("```", "").trim();
            return text;

        } catch (Exception e) {
            e.printStackTrace();
            return "AI 응답을 처리하는 중 오류가 발생했습니다.";
        }
    }
}