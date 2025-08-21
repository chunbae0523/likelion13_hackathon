package com.example.demo.controller;

import com.example.demo.dto.DailyStatsDto;
import com.example.demo.dto.InsightSummaryDto;
import com.example.demo.dto.PostRankingDto;
import com.example.demo.service.AiService;
import com.example.demo.service.InsightService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * '나의' 인사이트(통계) 관련 API 컨트롤러
 * 모든 주소는 /api/v1/users/me/insight 로 시작합니다.
 */
@RestController
@RequestMapping("/api/v1/users/me/insight")
@RequiredArgsConstructor
public class InsightController {

    // 실제 통계 로직을 처리하는 서비스
    private final InsightService insightService;
    // AI 제안 로직을 처리하는 서비스
    private final AiService aiService;

    /**
     * 나의 활동 요약 정보 및 AI 제안 조회
     * @param session 로그인한 사용자 정보를 확인하기 위함
     * @return 나의 활동 요약 정보와 AI 제안
     *
     * 호출 예시: GET /api/v1/users/me/insight/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getMySummary(HttpSession session) {
        // 세션에서 현재 로그인한 사용자의 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");
        // 로그인이 안 되어있으면 401 Unauthorized 에러
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 1. 서비스에게 ID를 전달하여 기본 통계 정보를 받아옴
        InsightSummaryDto summary = insightService.getMySummary(userId);

        // 2. 통계 정보를 바탕으로 AI 서비스에게 제안 생성을 요청
        String suggestion = aiService.generateSuggestion(summary);

        // 3. 통계 정보와 AI 제안을 합쳐서 하나의 응답으로 만듦
        Map<String, Object> response = Map.of(
                "summary", summary,
                "aiSuggestion", suggestion
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 나의 게시물 일별 조회수 통계 조회
     * @param startDate 조회 시작 날짜 (YYYY-MM-DD 형식)
     * @param endDate 조회 종료 날짜 (YYYY-MM-DD 형식)
     * @return 날짜별 조회수 목록
     *
     * 호출 예시: GET /api/v1/users/me/insight/views/daily?startDate=2025-08-01&endDate=2025-08-07
     */
    @GetMapping("/views/daily")
    public ResponseEntity<?> getMyDailyViewStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(insightService.getMyDailyViewStats(userId, startDate, endDate));
    }

    /**
     * 나의 게시물 랭킹 TOP 5 조회
     * @param type 랭킹 기준: "views"(조회수), "likes"(좋아요), "scraps"(스크랩)
     * @return 기준에 따른 나의 게시물 랭킹 목록
     *
     * 호출 예시: GET /api/v1/users/me/insight/ranking?type=views
     */
    @GetMapping("/ranking")
    public ResponseEntity<?> getMyPostRanking(@RequestParam String type, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");

        List<PostRankingDto> ranking = insightService.getMyPostRanking(userId, type);
        return ResponseEntity.ok(ranking);
    }

    /**
     * 나의 게시물 요일별 반응 차트 데이터 조회
     * @return 요일별 '좋아요' 합계 데이터
     *
     * 호출 예시: GET /api/v1/users/me/insight/weekly-stats
     */
    @GetMapping("/weekly-stats")
    public ResponseEntity<?> getMyWeeklyStats(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");

        Map<DayOfWeek, Long> stats = insightService.getMyWeeklyStats(userId);
        return ResponseEntity.ok(stats);
    }
}
