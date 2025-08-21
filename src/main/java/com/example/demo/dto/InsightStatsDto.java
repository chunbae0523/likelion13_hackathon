package com.example.demo.dto;

import lombok.Getter;

/**
 * (백엔드 내부용) 게시물 통계 합계를 담기 위한 DTO
 * PostRepository의 @Query 결과를 깔끔하게 받기 위해 사용됩니다.
 */
@Getter
public class InsightStatsDto {
    private final long totalViews;
    private final long totalLikes;
    private final long totalScrap;

    /**
     * JPA가 @Query에서 이 생성자를 직접 호출하여 결과를 바로 DTO로 만듭니다.
     * @param totalViews SUM(p.viewCount)의 결과
     * @param totalLikes SUM(p.likeCount)의 결과
     * @param totalScrap SUM(p.scrapCount)의 결과
     */
    public InsightStatsDto(Long totalViews, Long totalLikes, Long totalScrap) {
        // DB에서 합계가 null일 경우(게시물이 하나도 없을 때) 0으로 처리하여 안정성을 높입니다.
        this.totalViews = (totalViews != null) ? totalViews : 0L;
        this.totalLikes = (totalLikes != null) ? totalLikes : 0L;
        this.totalScrap = (totalScrap != null) ? totalScrap : 0L;
    }
}
