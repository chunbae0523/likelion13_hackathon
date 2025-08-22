package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class NotificationsController {

    @GetMapping("/notifications")
    public Map<String, Object> list() {
        return Map.of("items", List.of(
                Map.of("id","n1","type","like","text","누군가 내 글을 좋아함","created_at", Instant.now().toString()),
                Map.of("id","n2","type","follow","text","새 팔로워가 생김","created_at", Instant.now().toString())
        ));
    }
}
