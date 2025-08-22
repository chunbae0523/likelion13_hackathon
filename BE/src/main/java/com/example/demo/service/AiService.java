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
@RequiredArgsConstructor
public class AiService {

    private final ObjectMapper objectMapper;
    private final GenerativeModel generativeModel;

    /**
     * 사용자의 활동 데이터를 분석하여 게시물 랭킹을 높일 전략을 제안합니다.
     * @param summary 사용자의 활동 요약 DTO (총 게시물, 조회수, 좋아요, 스크랩 수)
     * @return AI가 생성한 전략 제안 문장
     */
    public String generateSuggestion(InsightSummaryDto summary) {

        // --- 1. AI에게 보낼 프롬프트(명령서)를 '데이터 분석가' 역할에 맞게 변경 ---
        String prompt = String.format(
                "당신은 사용자의 게시물 반응을 분석하여 더 높은 랭킹을 달성할 전략을 제안하는 데이터 분석가입니다. " +
                        "한 사용자의 데이터는 다음과 같습니다: 총 게시물 %d개, 누적 조회수 %d, 누적 좋아요 %d, 누적 스크랩 %d. " +
                        "이 데이터를 바탕으로, 사용자가 다음 게시물에서 시도해볼 만한 구체적인 전략을 한 문장으로 제안해주세요.",
                summary.getTotalMyPosts(),
                summary.getTotalMyViews(),
                summary.getTotalMyLikes(),
                summary.getTotalMyScraps()
        );

        // --- 2. TODO: 실제 Gemini API 호출 로직 ---
        // try {
        //     GenerateContentResponse response = this.generativeModel.generateContent(prompt);
        //     return ResponseHandler.getText(response);
        // } catch (Exception e) { ... }

        // --- 3. AI 호출 대신, 분석 규칙에 기반한 임시 제안 로직 ---
        //    (실제 AI가 있다면 이 부분은 필요 없습니다)
        long views = summary.getTotalMyViews();
        long likes = summary.getTotalMyLikes();
        long scraps = summary.getTotalMyScraps();

        // 조회수가 0이면 분석 불가
        if (views == 0) {
            return "게시물을 작성하여 사람들의 반응을 확인해보세요!";
        }

        // '좋아요 전환율'과 '스크랩 전환율' 계산
        double likeConversionRate = (double) likes / views;
        double scrapConversionRate = (double) scraps / views;

        if (likeConversionRate < 0.1) { // 좋아요 비율이 10% 미만일 경우
            return "조회수에 비해 좋아요 수가 적네요. 다음엔 더 매력적인 사진이나 솔직한 후기로 반응을 유도해보세요!";
        } else if (scrapConversionRate < 0.05) { // 스크랩 비율이 5% 미만일 경우
            return "사람들이 많이 보지만 저장하지는 않네요. '나만 알고 싶은 맛집' 같은 정보성 콘텐츠는 어떠세요?";
        } else if (summary.getTotalMyPosts() < 5) {
            return "게시물 수가 적을수록 눈에 띄기 어려워요. 꾸준히 포스팅해서 단골을 만들어보세요!";
        } else {
            return "훌륭한 반응을 얻고 있어요! 다음엔 새로운 종류의 가게를 리뷰해보는 건 어떨까요?";
        }
    }

    /**
     * 게시물 내용 기반으로 제목/해시태그 추천 (이전과 동일)
     */
    public AiSuggestionDto suggestTitleAndTags(String content) {
        String prompt = "다음은 사용자가 작성한 맛집 후기 내용이야. 이 내용에 가장 어울리는 매력적인 제목 3개와 관련 해시태그 5개를 추천해줘. 반드시 'titles'와 'hashtags' 키를 가진 JSON 객체 형식으로만 대답해줘. 내용은 다음과 같아: " + content;

        try {
            GenerateContentResponse response = this.generativeModel.generateContent(prompt);
            String aiResponseContent = ResponseHandler.getText(response);
            return objectMapper.readValue(aiResponseContent, AiSuggestionDto.class);
        } catch (Exception e) {
            log.error("Gemini API 호출 또는 파싱 실패", e);
            return new AiSuggestionDto(List.of("AI 추천 생성 실패"), List.of("#오류"));
        }
    }
}
