package com.spot.backend.domain.festival.dto;

import lombok.Data;
import java.util.List;

@Data // Lombok 어노테이션 @Getter + @Setter + @ToString + @EqualsAndHashCode
public class PlannerRequestDto {
    private String duration; // 여행기간 : "1박 2일", "당일치기"
    private String companion; // 동행 : "부모님", "연인", "친구들"
    private List<String> themes; // 테마 목록 : ["조용한", "힐링", "전통적인"]
    private String festivalName; // 축제 이름: "청남대 영춘제"

    // 주차장 및 주변 상권 검색을 위한 축제 좌표
    private double latitude;
    private double longitude;
}