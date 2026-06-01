package com.spot.backend.domain.festival.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity // DB 테이블과 매핑되는 JPA 엔티티
@Table(name = "festival") // 테이블 지정
@Getter // Lombok
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 외부에서 생성 차단
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name; // 축제명

    @Column(nullable = false, length = 100)
    private String region; // 지역

    @Column(length = 255)
    private String address;  // 상세 주소

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate; // 시작일

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate; // 종료일

    @Column(nullable = false)
    private Double lat; // 위도

    @Column(nullable = false)
    private Double lng; // 경도

    // 조회수 (기본값 0)
    @Column(name = "view_count", columnDefinition = "integer default 0")
    private int viewCount = 0;

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

    // 조회수를 1 증가 메서드
    public void incrementViewCount() {
        this.viewCount += 1;
    }
}