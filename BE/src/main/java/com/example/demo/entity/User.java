package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

/**
 * 사용자 정보 DB 테이블 설계도 (Entity)
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User {

    /** 사용자 고유 ID (자동 생성) */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 사용자 아이디 (중복 불가) */
    @Column(unique = true, nullable = false)
    private String username;

    /** 사용자 비밀번호 */
    @Column(nullable = false)
    private String password;

    /** 성별 ("MALE", "FEMALE") - 인사이트 기능용 */
    private String gender;

    /** 생년월일 - 인사이트 기능용 */
    private LocalDate birthDate;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
