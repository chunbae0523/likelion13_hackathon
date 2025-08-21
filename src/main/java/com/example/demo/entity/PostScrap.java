package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * '사용자-게시물' 스크랩 관계 DB 테이블
 * "누가 어떤 게시물을 스크랩했는지" 기록합니다.
 */
@Entity
@Getter
@NoArgsConstructor
public class PostScrap {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "post_id") private Post post;

    public PostScrap(User user, Post post) {
        this.user = user;
        this.post = post;
    }
}
