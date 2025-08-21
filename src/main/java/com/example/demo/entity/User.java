package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 DB 테이블 설계도 (Entity)
 */
@Entity
@Getter // Getter 자동 생성
@NoArgsConstructor // 기본 생성자 자동 생성
@Table(name = "users") // 'users' 라는 이름의 테이블로 생성
public class User {

    /**
     * 사용자 고유 ID (자동 생성)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 사용자 아이디 (중복 불가)
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * 사용자 비밀번호
     */
    @Column(nullable = false)
    private String password;

    /**
     * 회원가입 시 사용하는 생성자
     * @param username 사용자 아이디
     * @param password 사용자 비밀번호
     */
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
