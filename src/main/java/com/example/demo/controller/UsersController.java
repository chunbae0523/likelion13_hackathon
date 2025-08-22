package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * /api/v1/users 하위 - 마이페이지(주인) 엔드포인트
 * DB가 없는 개발 단계용: 메모리 저장소 사용
 */
@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    /* ---------- 인메모리 저장소 ---------- */
    private static final Map<Long, Map<String, Object>> USERS = Collections.synchronizedMap(new HashMap<>());
    static {
        // 샘플 사용자(seed)
        Map<String, Object> u1 = new HashMap<>();
        u1.put("id", 1L);
        u1.put("email", "user1@example.com");
        u1.put("nickname", "소문요정");
        u1.put("avatar_url", null);
        u1.put("role", "USER");
        u1.put("neighborhood", "강남구");
        u1.put("language", "ko");
        USERS.put(1L, u1);
    }

    /* 공통: 로그인 사용자 ID 추출 (없으면 1L) */
    private long currentUserId(HttpServletRequest req) {
        Object v = req.getAttribute("userId");
        return (v instanceof Number n) ? n.longValue() : 1L;
    }

    /** 내 정보 */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        long uid = currentUserId(req);
        Map<String, Object> me = USERS.get(uid);
        if (me == null) {
            return ResponseEntity.status(404).body(Map.of("message", "not found"));
        }
        String lang = String.valueOf(Objects.requireNonNullElse(me.get("language"), "ko"));
        return ResponseEntity.ok()
                .header("Content-Language", lang)
                .body(Map.of("me", me));
    }

    /** 내가 좋아요한 글 */
    @GetMapping("/me/likes")
    public Map<String, Object> likes() { return Map.of("items", List.of()); }

    /** 내가 쓴 댓글 */
    @GetMapping("/me/comments")
    public Map<String, Object> comments() { return Map.of("items", List.of()); }

    /** 스크랩 */
    @GetMapping("/me/scraps")
    public Map<String, Object> scraps() { return Map.of("items", List.of()); }

    /** 내가 작성한 소문 */
    @GetMapping("/me/posts")
    public Map<String, Object> posts() { return Map.of("items", List.of()); }

    /** 최근 본 소문 */
    @GetMapping("/me/recent")
    public Map<String, Object> recent() { return Map.of("items", List.of()); }

    /** 내 정보 수정 */
    public static class MeReq { public String nickname; public String neighborhood; }
    @PatchMapping("/me")
    public ResponseEntity<?> patchMe(@RequestBody MeReq body, HttpServletRequest req) {
        long uid = currentUserId(req);
        Map<String, Object> me = USERS.get(uid);
        if (me == null) return ResponseEntity.status(404).body(Map.of("message", "not found"));

        if (body != null) {
            if (body.nickname != null && !body.nickname.isBlank()) {
                me.put("nickname", body.nickname);
            }
            if (body.neighborhood != null && !body.neighborhood.isBlank()) {
                me.put("neighborhood", body.neighborhood);
            }
        }
        return ResponseEntity.ok(Map.of("ok", true));
    }

    /** 내 동네 조회 */
    @GetMapping("/me/neighborhood")
    public ResponseEntity<?> getNeighborhood(HttpServletRequest req) {
        long uid = currentUserId(req);
        Map<String, Object> me = USERS.get(uid);
        if (me == null) return ResponseEntity.status(404).body(Map.of("message", "not found"));
        return ResponseEntity.ok(Map.of("neighborhood", me.get("neighborhood")));
    }

    /** 내 동네 저장(변경) */
    public static class NeighborhoodReq { public String neighborhood; }
    @PutMapping("/me/neighborhood")
    public ResponseEntity<?> putNeighborhood(@RequestBody NeighborhoodReq body, HttpServletRequest req) {
        if (body == null || body.neighborhood == null || body.neighborhood.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "invalid neighborhood"));

        long uid = currentUserId(req);
        Map<String, Object> me = USERS.computeIfAbsent(uid, k -> new HashMap<>(Map.of("id", uid)));
        me.put("neighborhood", body.neighborhood);
        return ResponseEntity.ok(Map.of("neighborhood", body.neighborhood));
    }

    /** 언어 설정 (PATCH/PUT 둘 다 허용) */
    public static class LangReq { public String language; }
    @RequestMapping(path = "/me/language", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<?> setLanguage(@RequestBody LangReq body, HttpServletRequest req) {
        if (body == null || body.language == null)
            return ResponseEntity.badRequest().body(Map.of("message", "invalid language"));

        String lang = body.language.trim().toLowerCase(Locale.ROOT);
        if (!Set.of("ko", "en").contains(lang))
            return ResponseEntity.badRequest().body(Map.of("message", "invalid language"));

        long uid = currentUserId(req);
        Map<String, Object> me = USERS.computeIfAbsent(uid, k -> new HashMap<>(Map.of("id", uid)));
        me.put("language", lang);

        return ResponseEntity.ok()
                .header("Content-Language", lang)
                .body(Map.of("language", lang));
    }
}
