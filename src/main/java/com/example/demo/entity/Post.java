package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * 게시물 정보 DB 테이블 설계도 (Entity)
 * 프론트엔드는 이 구조를 기반으로 데이터를 받게 됩니다.
 */
@Entity
@Getter // Getter 자동 생성
@Setter // Setter 자동 생성
@NoArgsConstructor // 기본 생성자 자동 생성
public class Post {

    /**
     * 게시물 고유 ID (자동 생성)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 게시물 제목
    private String title;

    // 게시물 내용
    private String content;

    /**
     * 작성자 정보 (User 객체와 연결)
     * API 응답에서는 보통 author.username 같은 형태로 사용됩니다.
     */
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User author;

    /**
     * 연결된 가게 정보 (Store 객체와 연결)
     */
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "store_id")
    private Store store;

    // 게시물 작성 시간 (자동 생성)
    private LocalDateTime createdAt = LocalDateTime.now();

    // '좋아요' 수
    private int likeCount = 0;

    // 조회수
    private int viewCount = 0;

    // 스크랩 수
    private int scrapCount = 0;

    // 서버에 저장된 이미지 파일 이름
    private String storedFileName;

    /**
     * (백엔드 내부용) 게시물 생성 시 사용하는 생성자
     * @param title 게시물 제목
     * @param content 게시물 내용
     * @param author 작성자
     * @param store 연결된 가게
     */
    public Post(String title, String content, User author, Store store) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.store = store;
    }
}
