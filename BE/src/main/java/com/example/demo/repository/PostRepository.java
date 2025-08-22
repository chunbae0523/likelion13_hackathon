package com.example.demo.repository; // 패키지 이름이 demo인지 확인하세요.

import com.example.demo.dto.InsightStatsDto;
import com.example.demo.entity.Post;
import com.example.demo.entity.Store;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // ... 다른 메소드들은 그대로 ...
    List<Post> findTop10ByOrderByCreatedAtDesc();
    List<Post> findTop10ByOrderByLikeCountDesc();
    List<Post> findAllByStoreId(Long storeId);
    List<Post> findByStoreInOrderByCreatedAtDesc(List<Store> stores, Pageable pageable);
    List<Post> findAllByAuthor_Id(Long userId);
    List<Post> findTop5ByAuthor_IdOrderByViewCountDesc(Long userId);
    List<Post> findTop5ByAuthor_IdOrderByLikeCountDesc(Long userId);
    List<Post> findTop5ByAuthor_IdOrderByScrapCountDesc(Long userId);
    long countByAuthor_Id(Long userId);


    /**
     * 특정 사용자의 게시물 통계 합계를 DTO로 직접 조회합니다.
     * @Query 안의 DTO 경로를 실제 프로젝트에 맞게 수정했습니다.
     */
    @Query("SELECT new com.example.demo.dto.InsightStatsDto(SUM(p.viewCount), SUM(p.likeCount), SUM(p.scrapCount)) " +
            "FROM Post p WHERE p.author.id = :userId")
    InsightStatsDto findTotalStatsByAuthor_Id(@Param("userId") Long userId);
}
