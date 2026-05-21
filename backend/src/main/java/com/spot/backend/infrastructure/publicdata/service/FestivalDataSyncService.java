package com.spot.backend.infrastructure.publicdata.service;

import com.spot.backend.domain.festival.entity.Festival;
import com.spot.backend.domain.festival.repository.FestivalRepository;
import com.spot.backend.infrastructure.publicdata.dto.FestivalApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FestivalDataSyncService {

    private final FestivalRepository festivalRepository;
    private final RestClient restClient = RestClient.create();

    @Value("${public-data.api-key}")
    private String serviceKey;

    @Value("${public-data.festival-url}")
    private String festivalApiUrl;

    @Transactional
    public void syncFestivalData() {    //축제 공공데이터 API 호출 함수
        log.info("축제 공공데이터 API 전체 호출 시작...");
        int pageNo = 1;
        int savedCount = 0;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // while 문을 이용해 데이터가 없을 때까지 페이지를 계속 넘김
        while (true) {
            String requestUrl = String.format("%s?serviceKey=%s&pageNo=%d&numOfRows=100&type=json",
                    festivalApiUrl, serviceKey, pageNo);
            try {
                FestivalApiResponse apiResponse = restClient.get()
                        .uri(URI.create(requestUrl))
                        .retrieve()
                        .body(FestivalApiResponse.class);
                if (apiResponse == null || apiResponse.getResponse() == null || apiResponse.getResponse().getBody() == null) {
                    log.error("API 응답이 비어있거나 파싱에 실패했습니다. (page: {})", pageNo);
                    break;
                }
                List<FestivalApiResponse.Item> items = apiResponse.getResponse().getBody().getItems();
                // 더 이상 가져올 아이템이 없다면(마지막 페이지 통과) 루프를 탈출
                if (items == null || items.isEmpty()) {
                    log.info("모든 페이지(총 {}페이지) 탐색 완료!", pageNo - 1);
                    break;
                }
                log.info("[{}] 페이지에서 {} 개의 축제 데이터를 수신했습니다.", pageNo, items.size());
                for (FestivalApiResponse.Item item : items) {
                    try {
                        // 시작일 파싱
                        LocalDate startDate = LocalDate.parse(item.getFstvlStartDate(), formatter);

                        // 2026년도 축제만 필터링
                        if (startDate.getYear() != 2026) {
                            continue;
                        }
                        // 중복 체크 (DB에 이미 있는 축제면 패스)
                        if (festivalRepository.existsByNameAndStartDate(item.getFstvlNm(), startDate)) {
                            continue;
                        }
                        // 위경도 빈 값 체크
                        if (item.getLatitude() == null || item.getLatitude().trim().isEmpty() ||
                                item.getLongitude() == null || item.getLongitude().trim().isEmpty()) {
                            continue;
                        }
                        Double lat = Double.parseDouble(item.getLatitude());
                        Double lng = Double.parseDouble(item.getLongitude());
                        String regionName = item.getInsttNm();

                        Festival festival = Festival.builder()
                                .name(item.getFstvlNm())
                                .region(regionName)
                                .address(item.getRdnmadr() != null && !item.getRdnmadr().isEmpty() ? item.getRdnmadr() : item.getLnmadr())
                                .startDate(startDate)
                                .endDate(LocalDate.parse(item.getFstvlEndDate(), formatter))
                                .lat(lat)
                                .lng(lng)
                                .build();

                        festivalRepository.save(festival);
                        savedCount++;

                    } catch (Exception e) {
                        // 개별 아이템 파싱 오류는 무시하고 다음으로 넘어감
                    }
                }
                // 다음 페이지로 이동
                pageNo++;
            } catch (Exception e) {
                log.error("API 호출 중 예상치 못한 에러 발생 (page: {}): {}", pageNo, e.getMessage());
                break; // 통신 에러 발생 시 무한루프 방지를 위해 탈출
            }
        }

        log.info("2026년 축제 데이터 전체 동기화 완료! 총 신규 저장 건수: {}", savedCount);
    }
}