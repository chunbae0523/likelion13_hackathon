package com.example.app.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    @GetMapping
    public Map<String, Object> home(
            @RequestParam(defaultValue = "서울") String location,
            @RequestParam(defaultValue = "3") int limit,
            @RequestParam(name = "bannerLimit", defaultValue = "4") int bannerLimit
    ) {
        List<Map<String, Object>> banners = new ArrayList<>();
        for (int i = 0; i < bannerLimit; i++) {
            int n = (i % 3) + 1;
            banners.add(Map.of(
                    "id", "bn" + (i + 1),
                    "title", location + " 특가 배너 " + (i + 1),
                    "image", "/uploads/images/sample-" + n + ".png"
            ));
        }

        List<Map<String, Object>> today = new ArrayList<>();
        for (int i = 0; i < limit; i++) {
            today.add(Map.of(
                    "id", "p" + (i + 1),
                    "title", "오늘의 소문 " + (i + 1),
                    "summary", location + " 핫딜/이벤트 소식"
            ));
        }

        return Map.of("location", location, "banners", banners, "today", today);
    }
}
