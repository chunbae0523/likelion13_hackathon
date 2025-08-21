package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

/**
 * '나의' 인사이트 일별 통계 정보 응답 형식
 */
@Getter
@AllArgsConstructor
public class DailyStatsDto {
    private LocalDate date;
    private long viewCount;
}
