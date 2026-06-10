package com.spot.backend.domain.festival.repository;

import com.spot.backend.domain.festival.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

// Spring Data JPA가 제공하는 인터페이스 상속 -> 기본 CRUD 코드 필요 x
public interface FestivalRepository extends JpaRepository<Festival, Long> {
    // 메서드 이름으로 자동 쿼리 생성
    boolean existsByNameAndStartDate(String name, LocalDate startDate);

    // 지역 키워드로 address or region 컬럼 검색 (목록, 개수 반환)
    @Query("SELECT f FROM Festival f WHERE f.address LIKE %:keyword% OR f.region LIKE %:keyword%")
    List<Festival> findByRegionKeyword(@Param("keyword") String keyword);

    @Query("SELECT COUNT(f) FROM Festival f WHERE f.address LIKE %:keyword% OR f.region LIKE %:keyword%")
    long countByRegionKeyword(@Param("keyword") String keyword);
    
    // startData, endDate 사이에 축제 수 계산 (홈 화면에 필요 - Live)
    @Query("SELECT COUNT(f) FROM Festival f WHERE f.startDate <= :today AND f.endDate >= :today")
    long countLiveToday(@Param("today") LocalDate today);

    // 이름, 지역으로 검색하고 조회수 내림차순 정렬 (최대 50개)
    @Query("SELECT f FROM Festival f WHERE f.name LIKE %:q% OR f.region LIKE %:q% ORDER BY f.viewCount DESC")
    List<Festival> searchByKeyword(@Param("q") String q, org.springframework.data.domain.Pageable pageable);

    // 이번 달 축제 수 계산
    @Query("SELECT COUNT(f) FROM Festival f WHERE f.startDate <= :monthEnd AND f.endDate >= :monthStart")
    long countThisMonth(@Param("monthStart") LocalDate monthStart, @Param("monthEnd") LocalDate monthEnd);

    /*  Trending 기능 주석 처리
    // 종료되지 않은 축제 중 조회수 상위 8개 (홈 화면 Treding)
    @Query(value = "SELECT * FROM festival " +
            "WHERE start_date <= :nextWeek AND end_date >= :today " +
            "ORDER BY view_count DESC, id ASC " +
            "LIMIT 8", nativeQuery = true) // LIMIT 사용을 위해 nativeQuery 사용
    List<Festival> findTop8Trending(@Param("today") LocalDate today, @Param("nextWeek") LocalDate nextWeek);
    */

    // 유저가 선택한 날짜가 축제 시작일과 종료일 사이에 있고, 지역이 일치하는 축제 조회 ('전국'이면 지역 무시)
    @Query("SELECT f FROM Festival f WHERE (:region = '전국' OR f.region = :region) AND :date BETWEEN f.startDate AND f.endDate")
    List<Festival> findByRegionAndDateValid(@Param("region") String region, @Param("date") LocalDate date);

    // 특정 날짜에 진행 중인 축제 조회 (캘린더용, 조회수 내림차순 정렬)
    @Query("SELECT f FROM Festival f WHERE :date BETWEEN f.startDate AND f.endDate ORDER BY f.viewCount DESC")
    List<Festival> findFestivalsByDate(@Param("date") LocalDate date);
}
