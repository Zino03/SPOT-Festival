package com.spot.backend.domain.festival.controller;

import com.spot.backend.infrastructure.publicdata.service.FestivalDataSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


// DB 저장
@RestController
@RequestMapping("/api/test/festivals")
@RequiredArgsConstructor
public class FestivalTestController {
    private final FestivalDataSyncService syncService;
    @GetMapping("/sync")
    public String triggerSync() {
        syncService.syncFestivalData();
        return "축제 데이터 동기화가 호출되었습니다! IntelliJ 콘솔 로그를 확인하세요.";
    }
}