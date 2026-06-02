package com.spot.backend.domain.festival.dto;

import com.spot.backend.domain.festival.entity.Festival;
import lombok.Getter;

import java.time.LocalDate;

// DTO -> 프론트에 줄 데이터만 선택 (이후 비밀번호 등 필드 노출 방지)
@Getter // Lombok
public class FestivalDetailResponse {
    private final Long id; // private final로 선언해서 중간에 값 변경 방지
    private final String name;
    private final String region;
    private final String address;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final Double lat;
    private final Double lng;
    private final int viewCount;

    public FestivalDetailResponse(Festival festival) {
        // 생성자에서 직접 매팅 (엔티티를 받아서 필드에 하나씩)
        // 필드가 많지 않아 라이브러리 대신 이렇게 구현
        this.id = festival.getId();
        this.name = festival.getName();
        this.region = festival.getRegion();
        this.address = festival.getAddress();
        this.startDate = festival.getStartDate();
        this.endDate = festival.getEndDate();
        this.lat = festival.getLat();
        this.lng = festival.getLng();
        this.viewCount = festival.getViewCount();
    }
    // Stream의 .map(FestivalDetailResponse::from) 에서 호출될 메서드
    public static FestivalDetailResponse from(Festival festival) {
        return new FestivalDetailResponse(festival); // 위에 만들어둔 생성자 재활용!
    }
}
