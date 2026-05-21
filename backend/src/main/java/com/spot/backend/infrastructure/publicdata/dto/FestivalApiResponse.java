package com.spot.backend.infrastructure.publicdata.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FestivalApiResponse {
    private Response response;

    @Getter
    @Setter
    public static class Response {
        private Body body;
    }

    @Getter
    @Setter
    public static class Body {
        private List<Item> items;
    }
    @Getter
    @Setter
    public static class Item {
        @JsonProperty("fstvlNm")
        private String fstvlNm;       // 축제명

        @JsonProperty("insttNm")
        private String insttNm;       // 지역명 (제공기관명)

        @JsonProperty("rdnmadr")
        private String rdnmadr;       // 소재지도로명주소

        @JsonProperty("lnmadr")
        private String lnmadr;        // 소재지지번주소 (도로명주소가 없을 때 대비)

        @JsonProperty("fstvlStartDate") // 응답 데이터 구조에 맞춤
        private String fstvlStartDate;

        @JsonProperty("fstvlEndDate")   // 응답 데이터 구조에 맞춤
        private String fstvlEndDate;

        @JsonProperty("latitude")
        private String latitude;      // 위도

        @JsonProperty("longitude")
        private String longitude;     // 경도
    }
}