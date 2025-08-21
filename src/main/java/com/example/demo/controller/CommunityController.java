package com.example.demo.controller;

import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 커뮤니티 게시판 API 컨트롤러
 * 모든 주소는 /api/v1/community/posts 로 시작합니다.
 */
@RestController
@RequestMapping("/api/v1/community/posts")
@RequiredArgsConstructor
public class CommunityController {

    // 실제 게시물 로직을 처리하는 서비스
    private final PostService postService;

    /**
     * 게시물 목록 조회 (최신순/인기순)
     * @param sort 'new' 또는 'popular'
     * @param limit 가져올 개수 (기본 20)
     * @return 게시물 목록
     *
     * 호출 예시: GET /api/v1/community/posts?sort=new&limit=10
     */
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(@RequestParam String sort,
                                                          @RequestParam(defaultValue = "20") int limit) {

        // sort 파라미터가 유효한지 확인
        if (!"new".equals(sort) && !"popular".equals(sort)) {
            return ResponseEntity.badRequest().build(); // 잘못된 요청이면 400 에러
        }
        
        // 서비스에게 요청을 전달하고 결과를 받아옴
        List<PostResponseDto> posts = postService.getPosts(sort, limit);
        
        // 성공 시, 게시물 목록과 함께 200 OK 응답
        return ResponseEntity.ok(posts);
    }

    /**
     * 게시물 1개 상세 조회
     * @param postId 게시물의 ID
     * @return 게시물 상세 정보
     *
     * 호출 예시: GET /api/v1/community/posts/15
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetails(@PathVariable("postId") Long postId) {
        try {
            // 서비스에게 ID를 전달하고 결과를 받아옴
            return ResponseEntity.ok(postService.getPostDetails(postId));
        } catch (IllegalArgumentException e) {
            // 해당 ID의 게시물이 없으면 404 Not Found 에러
            return ResponseEntity.notFound().build();
        }
    }
}
