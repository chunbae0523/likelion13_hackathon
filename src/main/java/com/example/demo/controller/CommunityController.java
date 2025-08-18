package com.example.demo.controller;

import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/community/posts")
@RequiredArgsConstructor
public class CommunityController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(@RequestParam String sort,
                                                          @RequestParam(defaultValue = "20") int limit) {

        if (!"new".equals(sort) && !"popular".equals(sort)) {
            return ResponseEntity.badRequest().build();
        }
        List<PostResponseDto> posts = postService.getPosts(sort, limit);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDto> getPostDetails(@PathVariable("postId") Long postId) {
        try {
            return ResponseEntity.ok(postService.getPostDetails(postId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
