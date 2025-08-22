package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * '사용자-게시물' 좋아요 관계 DB 테이블
 * "누가 어떤 게시물에 좋아요를 눌렀는지" 기록합니다.
 */
@Entity
@Getter
@NoArgsConstructor
public class PostLike {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "post_id") private Post post;

    public PostLike(User user, Post post) {
        this.user = user;
        this.post = post;
    }
}
