package com.example.demo.controller;

import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.Store;
import com.example.demo.service.StoreService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/{storeId}")
    public ResponseEntity<Store> getStoreInfo(@PathVariable("storeId") Long storeId) {
        try {
            return ResponseEntity.ok(storeService.getStoreInfo(storeId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{storeId}/posts")
    public ResponseEntity<List<PostResponseDto>> getPostsByStore(@PathVariable("storeId") Long storeId) {
        return ResponseEntity.ok(storeService.getPostsByStore(storeId));
    }

    @PostMapping("/{storeId}/follow")
    public ResponseEntity<String> followStore(@PathVariable("storeId") Long storeId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        try {
            storeService.followStore(userId, storeId);
            return ResponseEntity.ok("가게 팔로우 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{storeId}/follow")
    public ResponseEntity<String> unfollowStore(@PathVariable("storeId") Long storeId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        try {
            storeService.unfollowStore(userId, storeId);
            return ResponseEntity.ok("가게 팔로우 취소 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
