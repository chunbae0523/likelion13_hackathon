package com.example.demo.controller;

import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.service.PostService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ---------------------- 문제되던 부분(겹침 유발) ----------------------
// @RestController
// @RequestMapping("/api/v1/posts")   // ❌ PostsController와 충돌 (같은 베이스 경로)
// ---------------------------------------------------------------------

// ✅ 명세 반영: 커뮤니티는 별도 네임스페이스로 분리
// (DB 환경에서만 켜고 싶으면 아래 @Profile("db") 주석을 해제하세요.)
// import org.springframework.context.annotation.Profile;
// @Profile("db")
@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityController {

    private final PostService postService;

    // --- 글 작성은 다른 컨트롤러에서 처리하므로 제외 ---

    /**
     * 최신/인기 글 목록
     * 명세: GET /api/v1/community/posts?sort=new|popular&limit=20&cursor=...
     */
    // ---------------------- 문제되던 부분(겹침 유발) ----------------------
    // @GetMapping                     // ❌ (기존) /api/v1/posts 와 충돌
    // ---------------------------------------------------------------------
    @GetMapping("/posts")              // ✅ (변경) /api/v1/community/posts
    public ResponseEntity<List<PostResponseDto>> getPosts(
            @RequestParam String sort,
            @RequestParam(defaultValue = "20") int limit) {

        if (!"new".equals(sort) && !"popular".equals(sort)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(postService.getPosts(sort, limit));
    }

    /**
     * 게시물 상세
     * 명세: GET /api/v1/community/posts/{postId}
     */
    // ---------------------- 문제되던 부분(겹침 유발) ----------------------
    // @GetMapping("/{postId}")        // ❌ (기존) /api/v1/posts/{postId} 와 충돌
    // ---------------------------------------------------------------------
    @GetMapping("/posts/{postId}")     // ✅ (변경)
    public ResponseEntity<PostDetailResponseDto> getPostDetails(@PathVariable Long postId) {
        try {
            return ResponseEntity.ok(postService.getPostDetails(postId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 좋아요
     * 명세: POST /api/v1/community/posts/{postId}/like
     */
    // (아래 두 개는 원래도 경로가 안 겹쳤지만, 일관성 위해 /community 붙임)
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        try {
            postService.likePost(userId, postId);
            return ResponseEntity.ok("좋아요 처리 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * 스크랩
     * 명세: POST /api/v1/community/posts/{postId}/scrap
     */
    @PostMapping("/posts/{postId}/scrap")
    public ResponseEntity<String> scrapPost(@PathVariable Long postId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        try {
            postService.scrapPost(userId, postId);
            return ResponseEntity.ok("스크랩 처리 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}

