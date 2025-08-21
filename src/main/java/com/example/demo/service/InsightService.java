package com.example.demo.service;

import com.example.demo.dto.DailyStatsDto;
import com.example.demo.dto.InsightSummaryDto;
import com.example.demo.dto.InsightStatsDto;
import com.example.demo.dto.PostRankingDto;
import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public InsightSummaryDto getMySummary(Long userId) {
        long totalMyPosts = postRepository.countByAuthor_Id(userId);
        InsightStatsDto stats = postRepository.findTotalStatsByAuthor_Id(userId);
        return new InsightSummaryDto(totalMyPosts, stats.getTotalViews(), stats.getTotalLikes(), stats.getTotalScrap());
    }

    @Transactional(readOnly = true)
    public List<DailyStatsDto> getMyDailyViewStats(Long userId, LocalDate startDate, LocalDate endDate) {
        // 가짜(더미) 데이터 생성 로직을 제거했습니다.
        // TODO: 실제 서비스를 위해서는 DB에서 날짜별로 데이터를 집계하는 로직을 여기에 구현해야 합니다.
        // 현재는 기능이 준비 중임을 나타내기 위해 비어있는 리스트를 반환합니다.
        return new ArrayList<>();
    }

    @Transactional(readOnly = true)
    public List<PostRankingDto> getMyPostRanking(Long userId, String type) {
        List<Post> posts = switch (type) {
            case "views" -> postRepository.findTop5ByAuthor_IdOrderByViewCountDesc(userId);
            case "likes" -> postRepository.findTop5ByAuthor_IdOrderByLikeCountDesc(userId);
            case "scraps" -> postRepository.findTop5ByAuthor_IdOrderByScrapCountDesc(userId);
            default -> new ArrayList<>();
        };
        return posts.stream()
                .map(post -> new PostRankingDto(post, type))
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<DayOfWeek, Long> getMyWeeklyStats(Long userId) {
        List<Post> myPosts = postRepository.findAllByAuthor_Id(userId);
        Map<DayOfWeek, Long> weeklyStats = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek day : DayOfWeek.values()) {
            weeklyStats.put(day, 0L);
        }
        for (Post post : myPosts) {
            DayOfWeek day = post.getCreatedAt().getDayOfWeek();
            long currentLikes = weeklyStats.get(day);
            weeklyStats.put(day, currentLikes + post.getLikeCount());
        }
        return weeklyStats;
    }
}
