package com.example.demo.controller;

import com.example.demo.dto.AiSuggestionDto;
import com.example.demo.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final AiService aiService;

    /**
     * 게시물 내용 기반으로 제목/해시태그 추천
     * 호출: POST /api/v1/ai/suggestions/post
     * 전송 데이터: { "content": "여기 파스타 정말 맛있어요..." }
     */
    @PostMapping("/suggestions/post")
    public ResponseEntity<AiSuggestionDto> suggestPostElements(@RequestBody Map<String, String> payload) {
        String content = payload.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        AiSuggestionDto suggestions = aiService.suggestTitleAndTags(content);
        return ResponseEntity.ok(suggestions);
    }
}
