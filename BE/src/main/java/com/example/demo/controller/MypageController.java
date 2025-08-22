package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 마이페이지(사장님 대시보드 등) 전용 컨트롤러
 * ⚠️ /api/v1/users/** 와 겹치지 않도록 기본은 /api/v1/mypage 아래로 제공
 *   - 단, 호환을 위해 "PUT /api/v1/users/me/language" 절대경로도 메서드에 추가 매핑함.
 */
@RestController
@RequestMapping("/api/v1/mypage")
public class MypageController {

    // ───────────────────────────────────────
    // 공통 유틸: 로그인 사용자 ID (Mock)
    private long userId(HttpServletRequest req) {
        Object id = req.getAttribute("userId"); // FakeAuthFilter 등에서 주입되었다고 가정
        return (id instanceof Long l) ? l : 1L;
    }

    // ───────────────────────────────────────
    // 내 정보/환경

    /** GET /api/v1/mypage/me  : 내 프로필(간단 Mock) */
    @GetMapping("/me")
    public Map<String, Object> me(HttpServletRequest req) {
        long uid = userId(req);
        Map<String, Object> user = Map.of(
                "id", uid,
                "nickname", "user123",
                "role", "owner",
                "language", "ko",
                "avatar_url", null
        );
        return Map.of("message", "success", "user", user);
    }

    /** PATCH /api/v1/mypage/me : 닉네임/아바타 등 일부 수정 */
    public static class PatchMeReq {
        public String nickname;
        public String avatar_url;
    }
    @PatchMapping("/me")
    public ResponseEntity<?> patchMe(@RequestBody PatchMeReq body, HttpServletRequest req) {
        long uid = userId(req);
        if ((body.nickname == null || body.nickname.isBlank()) &&
                (body.avatar_url == null || body.avatar_url.isBlank())) {
            return ResponseEntity.badRequest().body(Map.of("error", "nothing to update"));
        }
        // TODO: UPDATE users SET nickname=?, avatar_url=? WHERE id=uid
        Map<String, Object> updated = new HashMap<>();
        updated.put("id", uid);
        if (body.nickname != null) updated.put("nickname", body.nickname);
        if (body.avatar_url != null) updated.put("avatar_url", body.avatar_url);
        return ResponseEntity.ok(Map.of("message", "updated", "user", updated));
    }

    /** 언어 변경 요청 바디 */
    public static class LangReq { public String language; }

    /**
     * PUT /api/v1/mypage/language  (기본)
     * PUT /api/v1/users/me/language (호환: 절대경로 추가 매핑)
     *
     * Postman 예:
     *   Body(JSON): { "language": "ko" }  또는 { "language": "en" }
     */
    @PutMapping({"/language", "/api/v1/users/me/language"})
    public ResponseEntity<?> updateLanguage(@RequestBody LangReq req, HttpServletRequest httpReq) {
        if (req == null || req.language == null || req.language.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "language required"));
        }
        String lang = req.language.trim().toLowerCase(Locale.ROOT);
        if (!Set.of("ko", "en").contains(lang)) {
            return ResponseEntity.badRequest().body(Map.of("error", "invalid language"));
        }
        long uid = userId(httpReq);
        // TODO: UPDATE users SET language=? WHERE id=uid
        return ResponseEntity.ok(Map.of("message", "updated", "userId", uid, "language", lang));
    }

    /** 내 대시보드 개요 GET /api/v1/mypage/overview */
    @GetMapping("/overview")
    public Map<String, Object> overview(HttpServletRequest req) {
        long uid = userId(req);
        Map<String, Object> user = Map.of(
                "id", uid, "nickname", "나", "role", "owner",
                "avatar_url", null
        );
        Map<String, Object> stats = Map.of("posts", 12, "likes", 34);
        return Map.of("message", "success", "user", user, "stats", stats);
    }

    // ───────────────────────────────────────
    // 사장님 관련(가게)

    /** 내가 운영하는 가게 목록 GET /api/v1/mypage/stores */
    @GetMapping("/stores")
    public Map<String, Object> myStores(HttpServletRequest req) {
        long ownerId = userId(req);
        // TODO: SELECT * FROM stores WHERE owner_id=?
        var stores = List.of(
                Map.of("id", 1, "name", "내가게", "insights_url", "/insights?storeId=1")
        );
        return Map.of("message", "success", "stores", stores);
    }

    /** 가게 정보 수정 PATCH /api/v1/mypage/stores/{storeId} */
    public static class PatchStoreReq { public String name, address, phone, description, thumbnail_url; }
    @PatchMapping("/stores/{storeId}")
    public ResponseEntity<?> patchStore(@PathVariable Long storeId,
                                        @RequestBody PatchStoreReq body,
                                        HttpServletRequest req) {
        long ownerId = userId(req);
        // TODO: 소유자 검증 후 update stores set ...
        return ResponseEntity.ok(Map.of("message", "updated", "storeId", storeId));
    }

    /** 가게 리뷰 목록 GET /api/v1/mypage/stores/{storeId}/reviews */
    @GetMapping("/stores/{storeId}/reviews")
    public Map<String, Object> storeReviews(@PathVariable Long storeId) {
        // TODO: SELECT * FROM reviews WHERE store_id=?  + JOIN users
        return Map.of("message", "success", "reviews", List.of());
    }

    /** 가게 리뷰 삭제 DELETE /api/v1/mypage/stores/{storeId}/reviews/{reviewId} */
    @DeleteMapping("/stores/{storeId}/reviews/{reviewId}")
    public Map<String, Object> deleteReview(@PathVariable Long storeId,
                                            @PathVariable Long reviewId,
                                            HttpServletRequest req) {
        long ownerId = userId(req);
        // TODO: 소유자 검증 후 삭제
        return Map.of("message", "deleted");
    }
}
