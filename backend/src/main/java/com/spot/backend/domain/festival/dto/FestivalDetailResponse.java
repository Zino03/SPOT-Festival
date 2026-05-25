package com.spot.backend.domain.festival.dto;

import com.spot.backend.domain.festival.entity.Festival;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class FestivalDetailResponse {

    private final Long id;
    private final String name;
    private final String region;
    private final String address;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final Double lat;
    private final Double lng;
    private final int viewCount;
    private final double rating;

    public FestivalDetailResponse(Festival festival) {
        this.id = festival.getId();
        this.name = festival.getName();
        this.region = festival.getRegion();
        this.address = festival.getAddress();
        this.startDate = festival.getStartDate();
        this.endDate = festival.getEndDate();
        this.lat = festival.getLat();
        this.lng = festival.getLng();
        this.viewCount = festival.getViewCount();
        this.rating = festival.getRating();
    }
}
