package com.spot.backend.domain.planner.repository;

import com.spot.backend.domain.planner.entity.Planner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface PlannerRepository extends JpaRepository<Planner, Long> {

    // 축제 이름과 생성 날짜로 캐시된 플래너를 찾는 커스텀 쿼리 메서드
    Optional<Planner> findByFestivalNameAndCreatedAt(String festivalName, LocalDate createdAt);
}