package com.example.demo.controller;

import com.example.demo.service.AzureOpenAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AzureOpenAiService service;

    public AiController(AzureOpenAiService service) {
        this.service = service;
    }

    /** 요청 바디 스키마 */
    public static class PromotionReq {
        public String prompt;
        public String size = "1024x1024"; // "256x256" | "512x512" | "1024x1024"
    }

    /** POST /api/v1/ai/promotions  { "prompt": "...", "size": "512x512" } */
    @PostMapping("/promotions")
    public ResponseEntity<Map<String, Object>> createPromotion(@RequestBody PromotionReq req) {
        if (req == null || req.prompt == null || req.prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", Map.of("code", "BAD_REQUEST", "message", "prompt is required"))
            );
        }

        Map<String, Object> result = service.generatePromotionImage(req.prompt.trim(), req.size);
        Integer http = (Integer) result.remove("_http"); // 서비스가 에러일 때 넣어주는 상태코드
        return ResponseEntity.status(http == null ? 200 : http).body(result);
    }
}

