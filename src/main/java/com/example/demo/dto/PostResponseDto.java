package com.example.demo.dto;

import com.example.demo.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 게시물 정보를 클라이언트에게 전달하기 위한 DTO
 */
@Getter
public class PostResponseDto {
    private final Long id;
    private final String title;
    private final String authorUsername;
    private final LocalDateTime createdAt;
    private final int likeCount;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        // author가 null일 수 있는 경우 (탈퇴한 회원)를 처리합니다.
        this.authorUsername = (post.getAuthor() != null) ? post.getAuthor().getUsername() : "알 수 없음";
        this.createdAt = post.getCreatedAt();
        this.likeCount = post.getLikeCount();
    }
}
