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

    @Query("SELECT COUNT(f) FROM Festival f WHERE f.address LIKE %:keyword% OR f.region LIKE %:keyword%")
    long countByRegionKeyword(@Param("keyword") String keyword);

    @Query("SELECT COUNT(f) FROM Festival f WHERE f.startDate <= :today AND f.endDate >= :today")
    long countLiveToday(@Param("today") LocalDate today);

    @Query("SELECT f FROM Festival f WHERE f.name LIKE %:q% OR f.region LIKE %:q% ORDER BY f.viewCount DESC")
    List<Festival> searchByKeyword(@Param("q") String q, org.springframework.data.domain.Pageable pageable);

    @Query("SELECT COUNT(f) FROM Festival f WHERE f.startDate <= :monthEnd AND f.endDate >= :monthStart")
    long countThisMonth(@Param("monthStart") LocalDate monthStart, @Param("monthEnd") LocalDate monthEnd);
    // Trending: 종료되지 않은 축제 중 조회수 상위 8개
    @Query(value = "SELECT * FROM festival " +
            "WHERE end_date >= :today " +
            "ORDER BY view_count DESC, id ASC " +
            "LIMIT 8", nativeQuery = true)
    List<Festival> findTop8Trending(@Param("today") LocalDate today);
}
