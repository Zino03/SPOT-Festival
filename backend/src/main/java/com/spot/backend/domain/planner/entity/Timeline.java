package com.spot.backend.domain.planner.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_timelines")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Timeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String time; // 예: "11:00"
    private String place; // 예: "한강 공영주차장"
    private String activity; // 예: "도착 · 무료 주차 2시간"

    // N:1 관계 (여러 타임라인이 하나의 플래너에 속함)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planner_id")
    private Planner planner;

    @Builder
    public Timeline(String time, String place, String activity) {
        this.time = time;
        this.place = place;
        this.activity = activity;
    }

    // Planner를 세팅하기 위한 메서드
    public void setPlanner(Planner planner) {
        this.planner = planner;
    }
}