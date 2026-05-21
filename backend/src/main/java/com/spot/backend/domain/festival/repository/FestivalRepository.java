package com.spot.backend.domain.festival.repository;

import com.spot.backend.domain.festival.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    boolean existsByNameAndStartDate(String name, LocalDate startDate);
}