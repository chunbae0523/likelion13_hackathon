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

/**
 * 게시물(Post) 관련 API 컨트롤러
 * 모든 주소는 /api/v1/posts 로 시작하도록 통일합니다.
 */
//@RestController
//@RequestMapping("/api/v1/posts") // URL을 /api/v1/posts로 변경
@RequiredArgsConstructor
public class CommunityController { // 클래스 이름을 PostController로 변경

    private final PostService postService;

    // --- '글 작성'(@PostMapping) 기능은 다른 팀원이 만들었으므로 여기서 제거합니다. ---

    /**
     * 게시물 목록 조회 (최신순/인기순)
     * 호출: GET /api/v1/posts?sort=new&limit=10
     */
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(@RequestParam String sort, @RequestParam(defaultValue = "20") int limit) {
        if (!"new".equals(sort) && !"popular".equals(sort)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(postService.getPosts(sort, limit));
    }

    /**
     * 게시물 1개 상세 조회
     * 호출: GET /api/v1/posts/15
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetails(@PathVariable Long postId) {
        try {
            return ResponseEntity.ok(postService.getPostDetails(postId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 게시물 좋아요
     * 호출: POST /api/v1/posts/15/like
     */
    @PostMapping("/{postId}/like")
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
     * 게시물 스크랩
     * 호출: POST /api/v1/posts/15/scrap
     */
    @PostMapping("/{postId}/scrap")
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
