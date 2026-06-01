package com.spot.backend.domain.planner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ai_planners")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Planner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 캐싱 조회를 위한 핵심 필드 (어떤 축제의 언제 만들어진 코스인가?)
    private String festivalName;
    private LocalDate createdAt;

    // AI 추천 이유 또는 코스 제목
    private String title;

    // 1:N 양방향 매핑 (플래너 1개에 타임라인 여러 개)
    @OneToMany(mappedBy = "planner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Timeline> timelines = new ArrayList<>();

    @Builder
    public Planner(String festivalName, LocalDate createdAt, String title) {
        this.festivalName = festivalName;
        this.createdAt = createdAt;
        this.title = title;
    }

    // 연관관계 편의 메서드 (타임라인 추가 시 양쪽 모두 세팅)
    public void addTimeline(Timeline timeline) {
        timelines.add(timeline);
        timeline.setPlanner(this);
    }
}