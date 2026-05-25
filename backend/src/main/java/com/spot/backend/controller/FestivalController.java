package com.spot.backend.controller;

import com.spot.backend.domain.festival.entity.Festival;
import com.spot.backend.domain.festival.repository.FestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FestivalController {

    private final FestivalRepository festivalRepository;

    @GetMapping("/trending")
    public List<Festival> getTrendingFestivals() {
        LocalDate today = LocalDate.now();
        return festivalRepository.findTop8Trending(today);
    }
}