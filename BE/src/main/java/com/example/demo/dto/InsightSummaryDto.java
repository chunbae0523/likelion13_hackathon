package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * '나의' 인사이트 요약 정보 응답 형식
 */
@Getter
@AllArgsConstructor
public class InsightSummaryDto {
    private long totalMyPosts;
    private long totalMyViews;
    private long totalMyLikes;
    private long totalMyScraps;
}
