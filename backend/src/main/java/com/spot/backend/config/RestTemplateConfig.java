package com.spot.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.List;


// 설정 클래스 (외부 API를 호출)
// 공공데이터 API가 JSON 응답 시 
// application/json이 아닌 text/html 으로 보내는 케이스 해결
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // 공공API가 JSON을 text/html로 반환하는 경우 
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(List.of(
            MediaType.APPLICATION_JSON,
            MediaType.TEXT_HTML,
            MediaType.TEXT_PLAIN
        ));
        restTemplate.getMessageConverters().add(0, converter);
        // 기존 컨버터 목록 맨 앞에 넣기
        // Spring은 컨버터를 순서대로 순회하기 때문에

        return restTemplate;
    }
}