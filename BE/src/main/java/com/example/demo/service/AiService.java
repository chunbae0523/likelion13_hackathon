package com.example.demo.service;

import com.example.demo.dto.AiSuggestionDto;
import com.example.demo.dto.InsightSummaryDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor // Lombok이 final 필드에 대한 생성자를 자동으로 만들어줍니다.
public class AiService {

    private final ObjectMapper objectMapper;
    // AiConfig에서 미리 만들어준 GenerativeModel Bean을 바로 주입받습니다.
    private final GenerativeModel generativeModel;

    /**
     * 게시물 내용을 기반으로 제목과 해시태그를 추천하는 Gemini AI 기능
     */
    public AiSuggestionDto suggestTitleAndTags(String content) {
        String prompt = "다음은 사용자가 작성한 맛집 후기 내용이야. 이 내용에 가장 어울리는 매력적인 제목 3개와 관련 해시태그 5개를 추천해줘. 반드시 'titles'와 'hashtags' 키를 가진 JSON 객체 형식으로만 대답해줘. 내용은 다음과 같아: " + content;

        try {
            // Gemini 모델에 콘텐츠 생성 요청
            GenerateContentResponse response = this.generativeModel.generateContent(prompt);
            // AI의 응답 텍스트를 추출
            String aiResponseContent = ResponseHandler.getText(response);

            // AI가 보내준 JSON 형식의 텍스트를 DTO로 변환
            return objectMapper.readValue(aiResponseContent, AiSuggestionDto.class);
        } catch (Exception e) {
            log.error("Gemini API 호출 또는 파싱 실패", e);
            // API 호출 실패 시 기본 응답
            return new AiSuggestionDto(List.of("AI 추천 생성 실패"), List.of("#오류"));
        }
    }

    /**
     * 사용자의 활동 요약 데이터를 기반으로 개인화된 제안을 생성하는 기능
     */
    public String generateSuggestion(InsightSummaryDto summary) {
        // 이 부분도 위와 동일한 방식으로 Gemini API를 호출하여 구현할 수 있습니다.
        if (summary.getTotalMyLikes() > 50) {
            return "벌써 " + summary.getTotalMyLikes() + "개의 좋아요를 받으셨네요! 다음엔 인기글에 도전해보세요!";
        } else {
            return "첫 게시물을 작성하고 사람들과 소통을 시작해보세요!";
        }
    }
}
