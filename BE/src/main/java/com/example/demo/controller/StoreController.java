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

/**
 * 가게 관련 API 컨트롤러
 * 모든 주소는 /api/v1/stores 로 시작합니다.
 */
@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    // 실제 가게 관련 로직을 처리하는 서비스
    private final StoreService storeService;

    /**
     * 가게 1개 정보 조회
     * @param storeId 가게의 ID
     * @return 가게 상세 정보
     *
     * 호출 예시: GET /api/v1/stores/5
     */
    @GetMapping("/{storeId}")
    public ResponseEntity<Store> getStoreInfo(@PathVariable("storeId") Long storeId) {
        try {
            // 서비스에게 ID를 전달하고 가게 정보를 받아옴
            return ResponseEntity.ok(storeService.getStoreInfo(storeId));
        } catch (IllegalArgumentException e) {
            // 해당 ID의 가게가 없으면 404 Not Found 에러
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 특정 가게에 작성된 모든 게시물 목록 조회
     * @param storeId 가게의 ID
     * @return 해당 가게의 게시물 목록
     *
     * 호출 예시: GET /api/v1/stores/5/posts
     */
    @GetMapping("/{storeId}/posts")
    public ResponseEntity<List<PostResponseDto>> getPostsByStore(@PathVariable("storeId") Long storeId) {
        // 서비스에게 가게 ID를 전달하고 게시물 목록을 받아옴
        return ResponseEntity.ok(storeService.getPostsByStore(storeId));
    }

    /**
     * 가게 팔로우 하기
     * @param storeId 팔로우할 가게의 ID
     * @param session 로그인한 사용자 정보를 확인하기 위함
     * @return 성공/실패 메시지
     *
     * 호출 예시: POST /api/v1/stores/5/follow
     */
    @PostMapping("/{storeId}/follow")
    public ResponseEntity<String> followStore(@PathVariable("storeId") Long storeId, HttpSession session) {
        // 세션에서 현재 로그인한 사용자의 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");
        // 로그인이 안 되어있으면 401 Unauthorized 에러
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        try {
            // 서비스에게 팔로우 처리를 요청
            storeService.followStore(userId, storeId);
            return ResponseEntity.ok("가게 팔로우 성공");
        } catch (Exception e) {
            // 이미 팔로우한 경우 등 예외 발생 시 409 Conflict 에러
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * 가게 팔로우 취소
     * @param storeId 팔로우를 취소할 가게의 ID
     * @param session 로그인한 사용자 정보를 확인하기 위함
     * @return 성공/실패 메시지
     *
     * 호출 예시: DELETE /api/v1/stores/5/follow
     */
    @DeleteMapping("/{storeId}/follow")
    public ResponseEntity<String> unfollowStore(@PathVariable("storeId") Long storeId, HttpSession session) {
        // 세션에서 현재 로그인한 사용자의 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");
        // 로그인이 안 되어있으면 401 Unauthorized 에러
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        try {
            // 서비스에게 팔로우 취소 처리를 요청
            storeService.unfollowStore(userId, storeId);
            return ResponseEntity.ok("가게 팔로우 취소 성공");
        } catch (Exception e) {
            // 팔로우하지 않은 가게를 취소하려는 경우 등 예외 발생 시 400 Bad Request 에러
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
