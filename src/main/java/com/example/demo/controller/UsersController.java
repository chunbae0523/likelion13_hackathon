package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * /api/v1/users 하위 - 마이페이지(주인) 엔드포인트
 */
@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final JdbcTemplate jdbc;

    public UsersController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
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
        try {
            var rows = jdbc.queryForList("""
                SELECT id, email, nickname, avatar_url, role, neighborhood, `language`
                FROM users WHERE id=?
            """, uid);
            if (rows.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "not found"));
            }
            var me = rows.get(0);
            String lang = String.valueOf(
                    Optional.ofNullable(me.get("language")).orElse("ko")
            );
            return ResponseEntity.ok()
                    .header("Content-Language", lang)
                    .body(Map.of("me", me));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "DB error"));
        }
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
        try {
            if (body != null && body.nickname != null)
                jdbc.update("UPDATE users SET nickname=? WHERE id=?", body.nickname, uid);
            if (body != null && body.neighborhood != null)
                jdbc.update("UPDATE users SET neighborhood=? WHERE id=?", body.neighborhood, uid);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "DB error"));
        }
    }

    /** 내 동네 조회 */
    @GetMapping("/me/neighborhood")
    public ResponseEntity<?> getNeighborhood(HttpServletRequest req) {
        long uid = currentUserId(req);
        try {
            var row = jdbc.queryForMap("SELECT neighborhood FROM users WHERE id=?", uid);
            return ResponseEntity.ok(Map.of("neighborhood", row.get("neighborhood")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "DB error"));
        }
    }

    /** 내 동네 저장(변경) */
    public static class NeighborhoodReq { public String neighborhood; }
    @PutMapping("/me/neighborhood")
    public ResponseEntity<?> putNeighborhood(@RequestBody NeighborhoodReq body, HttpServletRequest req) {
        if (body == null || body.neighborhood == null || body.neighborhood.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "invalid neighborhood"));
        long uid = currentUserId(req);
        try {
            jdbc.update("UPDATE users SET neighborhood=? WHERE id=?", body.neighborhood, uid);
            return ResponseEntity.ok(Map.of("neighborhood", body.neighborhood));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "DB error"));
        }
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
        try {
            jdbc.update("UPDATE users SET `language`=? WHERE id=?", lang, uid);
            return ResponseEntity.ok()
                    .header("Content-Language", lang)
                    .body(Map.of("language", lang));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "DB error"));
        }
    }
}
