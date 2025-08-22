package com.example.demo.controller;

import com.example.demo.dto.PostCreateRequestDto;
import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.service.PostService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/community/posts")
@RequiredArgsConstructor
public class CommunityController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostCreateRequestDto requestDto, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        postService.createPost(requestDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body("게시물 작성 완료");
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(@RequestParam String sort, @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(postService.getPosts(sort, limit));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetails(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostDetails(postId));
    }

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