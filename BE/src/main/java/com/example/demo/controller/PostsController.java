package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v1/posts")
public class PostsController {

    public static class PostReq {
        public String content;
        public List<String> images = List.of();
        public List<String> videos = List.of();
        public List<String> tags   = List.of();
        public Map<String, Object> location; // {lat,lng}
    }

    public static class PostRes {
        public String id;
        public String content;
        public List<String> images;
        public List<String> videos;
        public List<String> tags;
        public Map<String, Object> location;
        public String created_at;
    }

    // 최신글이 앞으로 오도록 맨 앞에 추가 → 조회는 slice 느낌으로
    private static final List<PostRes> POSTS = new CopyOnWriteArrayList<>();

    // GET /api/v1/posts?limit=20&offset=0
    @GetMapping
    public Map<String, Object> list(@RequestParam(defaultValue = "20") int limit,
                                    @RequestParam(defaultValue = "0") int offset) {
        int lim = Math.min(100, Math.max(1, limit));
        int off = Math.max(0, offset);
        int end = Math.min(POSTS.size(), off + lim);
        List<PostRes> items = POSTS.subList(Math.min(off, POSTS.size()), end);
        return Map.of("total", POSTS.size(), "limit", lim, "offset", off, "items", items);
    }

    // GET /api/v1/posts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return POSTS.stream()
                .filter(p -> Objects.equals(p.id, id))
                .findFirst()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                        "error", Map.of("code","NOT_FOUND","message","post not found"))));
    }

    // POST /api/v1/posts
    @PostMapping
    public ResponseEntity<?> create(@RequestBody PostReq body) {
        String content = body == null || body.content == null ? "" : body.content.trim();
        if (content.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", Map.of("code","BAD_REQUEST","message","content required")));
        }
        PostRes p = new PostRes();
        p.id = UUID.randomUUID().toString();
        p.content = content;
        p.images = body.images == null ? List.of() : body.images;
        p.videos = body.videos == null ? List.of() : body.videos;
        p.tags   = body.tags   == null ? List.of() : body.tags;
        p.location = body.location; // 그대로 보관
        p.created_at = Instant.now().toString();

        // 최신글 맨 앞
        POSTS.add(0, p);
        return ResponseEntity.status(201).body(p);
    }
}
