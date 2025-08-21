package com.example.demo.dto;

import java.util.List;

/**
 * AI가 추천해준 제목과 해시태그를 담는 DTO
 */
public record AiSuggestionDto(List<String> suggestedTitles, List<String> suggestedHashtags) {}
