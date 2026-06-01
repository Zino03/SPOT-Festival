package com.spot.backend.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 외부 API (RestClient) 호출 중 에러가 발생했을 때 한 곳에 잡아서 처리
    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<Map<String, String>> handleExternalApiException(RestClientResponseException ex) {

        // 구글 Gemini 서버가 바빠서 503(Service Unavailable)을 뱉은 경우
        if (ex.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE) // 프론트엔드에게 503 상태 코드 전달
                    .body(Map.of("message", "현재 AI 서버에 접속자가 많아 혼잡합니다. 잠시 후 다시 시도해 주세요."));
        }

        // 그 외의 외부 API 에러 (카카오 API 키 오류, 구글 서버 500 에러 등)
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(Map.of("message", "외부 서비스 연동 중 문제가 발생했습니다. 관리자에게 문의하세요."));
    }
}