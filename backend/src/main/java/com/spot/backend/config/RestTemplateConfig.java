package com.spot.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.List;


// 설정 클래스
// RestTemplate은 공공포털 API 같은 외부 API를 호출할 때 쓰는 도구

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

        return restTemplate;
    }
}