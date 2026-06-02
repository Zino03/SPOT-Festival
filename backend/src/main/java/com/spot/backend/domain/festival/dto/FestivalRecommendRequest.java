package com.spot.backend.domain.festival.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class FestivalRecommendRequest {
    private String region;
    private LocalDate date;
    private String companion;
    private List<String> themes;
}