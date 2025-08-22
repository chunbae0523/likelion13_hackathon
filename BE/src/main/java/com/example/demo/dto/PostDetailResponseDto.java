package com.example.demo.dto;

import com.example.demo.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 게시물 상세 정보를 전달하기 위한 DTO (내용 포함)
 */
@Getter
public class PostDetailResponseDto {
    private final Long id;
    private final String title;
    private final String content;
    private final String authorUsername;
    private final String storeName;
    private final LocalDateTime createdAt;
    private final int likeCount;

    public PostDetailResponseDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorUsername = (post.getAuthor() != null) ? post.getAuthor().getUsername() : "알 수 없음";
        this.storeName = (post.getStore() != null) ? post.getStore().getName() : "연결된 가게 없음";
        this.createdAt = post.getCreatedAt();
        this.likeCount = post.getLikeCount();
    }
}
