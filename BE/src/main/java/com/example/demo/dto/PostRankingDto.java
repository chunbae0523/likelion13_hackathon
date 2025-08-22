package com.example.demo.dto;

import com.example.demo.entity.Post;
import lombok.Getter;

/**
 * '나의' 게시물 랭킹 정보를 담는 DTO
 */
@Getter
public class PostRankingDto {
    private final Long postId;
    private final String title;
    private final int value; // 조회수, 좋아요 수 등 랭킹 기준 값

    public PostRankingDto(Post post, String type) {
        this.postId = post.getId();
        this.title = post.getTitle();
        // type에 따라 조회수, 좋아요, 스크랩 수를 담음
        this.value = switch (type) {
            case "views" -> post.getViewCount();
            case "likes" -> post.getLikeCount();
            case "scraps" -> post.getScrapCount();
            default -> 0;
        };
    }
}
