package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자가 가게를 팔로우하는 '관계' 자체를 저장하는 DB 테이블 설계도 (Entity)
 * "누가 어떤 가게를 팔로우했는지"를 기록하는 중간 다리 역할을 합니다.
 */
@Entity
@Getter // Getter 자동 생성
@NoArgsConstructor // 기본 생성자 자동 생성
public class StoreFollow {

    /**
     * 팔로우 관계의 고유 ID (자동 생성)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 팔로우를 '한' 사용자 (User Entity와 연결)
     * @ManyToOne: 여러(Many) 팔로우 관계는 한 명(One)의 사용자에게 속합니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * 팔로우를 '당한' 가게 (Store Entity와 연결)
     * @ManyToOne: 여러(Many) 팔로우 관계는 한 곳(One)의 가게에 속합니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    /**
     * 팔로우 관계를 생성할 때 사용하는 생성자
     * @param user 팔로우 하는 사용자
     * @param store 팔로우 당하는 가게
     */
    public StoreFollow(User user, Store store) {
        this.user = user;
        this.store = store;
    }
}
