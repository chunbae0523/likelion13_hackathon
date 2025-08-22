package com.example.demo.controller;

import com.example.demo.dto.HomeResponseDto;
import com.example.demo.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService; // HomeService 주입

    @GetMapping
    public ResponseEntity<HomeResponseDto> getHomeFeed(@RequestParam String location,
                                                       @RequestParam(defaultValue = "3") int limit,
                                                       @RequestParam(defaultValue = "4") int bannerLimit) {

        HomeResponseDto homeFeed = homeService.getHomeFeed(location, limit, bannerLimit);
        return ResponseEntity.ok(homeFeed);
    }
}
