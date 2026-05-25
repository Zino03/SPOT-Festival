package com.spot.backend.domain.festival.repository;

import com.spot.backend.domain.festival.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    boolean existsByNameAndStartDate(String name, LocalDate startDate);
    //Trending 최대 8개 축제 가져오기 로직
    //우선순위 : 조회수->평점->ID 순
    @Query(value = "SELECT * FROM festival " +
            "WHERE end_date >= :today " +
            "ORDER BY view_count DESC, rating DESC, id ASC " +
            "LIMIT 8", nativeQuery = true)
    List<Festival> findTop8Trending(@Param("today") LocalDate today);
}
