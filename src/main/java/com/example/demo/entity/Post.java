package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 게시물 정보를 담는 데이터베이스 테이블의 설계도(Entity)입니다.
 * 이 클래스를 기반으로 DB에 'Post' 테이블이 생성됩니다.
 */
@Entity
@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메소드를 자동으로 생성합니다. (예: getTitle())
@Setter // Lombok: Setter 메소드를 자동으로 생성합니다. (예: setTitle())
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 생성합니다.
public class Post {

    /**
     * 게시물의 고유 ID (Primary Key)
     * @GeneratedValue: ID 값을 데이터베이스가 자동으로 생성해줍니다.
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 게시물의 제목
     */
    private String title;

    /**
     * 게시물의 전체 내용
     */
    private String content;

    /**
     * 게시물 작성자 정보 (User Entity와의 관계)
     * @ManyToOne: 게시물(Many)은 사용자(One) 한 명에게 속합니다.
     * @JoinColumn: 'user_id' 라는 이름의 컬럼을 통해 User 테이블과 연결됩니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    /**
     * 게시물과 연결된 가게 정보 (Store Entity와의 관계)
     * @ManyToOne: 게시물(Many)은 가게(One) 한 곳에 속할 수 있습니다.
     * @JoinColumn: 'store_id' 라는 이름의 컬럼을 통해 Store 테이블과 연결됩니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    /**
     * 게시물 생성 시간
     * 객체가 생성될 때의 시간이 자동으로 저장됩니다.
     */
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * 게시물이 받은 '좋아요' 개수
     * 기본값은 0입니다.
     */
    private int likeCount = 0;

    // 참고: 이미지 파일 이름을 저장하는 'storedFileName' 같은 필드는
    // 이미지 업로드 기능을 구현할 때 여기에 추가됩니다.
}
