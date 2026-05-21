package com.spot.backend.domain.festival.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "festival")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;           // 축제명

    @Column(nullable = false, length = 100)
    private String region;         // 지역

    @Column(length = 255)
    private String address;        // 상세 주소

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;   // 시작일

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;     // 종료일

    @Column(nullable = false)
    private Double lat;            // 위도

    @Column(nullable = false)
    private Double lng;            // 경도

    @Builder
    public Festival(String name, String region, String address, LocalDate startDate, LocalDate endDate, Double lat, Double lng) {
        this.name = name;
        this.region = region;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
        this.lat = lat;
        this.lng = lng;
    }
}