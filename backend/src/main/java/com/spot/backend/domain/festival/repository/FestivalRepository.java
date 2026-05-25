package com.spot.backend.domain.festival.repository;

import com.spot.backend.domain.festival.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
    boolean existsByNameAndStartDate(String name, LocalDate startDate);

    @Query("SELECT f FROM Festival f WHERE f.address LIKE %:keyword% OR f.region LIKE %:keyword%")
    List<Festival> findByRegionKeyword(@Param("keyword") String keyword);
    //Trending 이번주 최대 8개 축제 가져오기 로직
    //우선순위 : 조회수->평점->ID 순
    @Query(value = "SELECT * FROM festival " +
            "WHERE start_date <= :nextWeek AND end_date >= :today " +
            "ORDER BY view_count DESC, rating DESC, id ASC " +
            "LIMIT 8", nativeQuery = true)
    List<Festival> findTop8Trending(@Param("today") LocalDate today, @Param("nextWeek") LocalDate nextWeek);
}
