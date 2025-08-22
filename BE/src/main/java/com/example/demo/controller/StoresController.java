package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/stores")
public class StoresController {

    // 간단 더미
    private static final List<Map<String, Object>> MOCK_STORES = List.of(
            Map.of("id", 1, "name", "우드톤카페", "address", "서울 어딘가"),
            Map.of("id", 2, "name", "분식천국",   "address", "부산 어딘가")
    );

    // GET /api/v1/stores
    @GetMapping
    public List<Map<String, Object>> list() {
        return MOCK_STORES;
    }

    // GET /api/v1/stores/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return MOCK_STORES.stream().filter(s -> Objects.equals(((Number)s.get("id")).longValue(), id))
                .findFirst()
                .<ResponseEntity<?>>map(s -> ResponseEntity.ok(new HashMap<>() {{
                    putAll(s);
                    put("photos", List.of());
                    put("desc", "우드톤 인테리어가 예쁜 가게에요.");
                }}))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error","not found")));
    }

    // === 리뷰 목록 (DB 연동은 TODO) ===
    // GET /api/v1/stores/{storeId}/reviews
    @GetMapping("/{storeId}/reviews")
    public Map<String, Object> reviews(@PathVariable Long storeId) {
        // TODO: SELECT ... FROM store_reviews JOIN users ...
        List<Map<String, Object>> rows = List.of(
                Map.of("id", 10, "rating", 5, "content", "너무 좋아요", "created_at", Instant.now().toString(),
                        "author", "홍길동", "avatar_url", null)
        );
        return Map.of("message","success", "reviews", rows);
    }

    // GET /api/v1/stores/{storeId}/reviews/{reviewId}
    @GetMapping("/{storeId}/reviews/{reviewId}")
    public ResponseEntity<?> review(@PathVariable Long storeId, @PathVariable Long reviewId) {
        // TODO: WHERE store_id=? AND id=?
        Map<String, Object> row = Map.of(
                "id", reviewId, "rating", 4, "content", "재방문 의사 있어요", "created_at", Instant.now().toString(),
                "author", "아무개", "avatar_url", null
        );
        return ResponseEntity.ok(Map.of("message", "success", "review", row));
    }
}
