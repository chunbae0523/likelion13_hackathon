package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 가게 정보 DB 테이블 설계도 (Entity)
 */
@Entity
@Getter // Getter 자동 생성
@Setter // Setter 자동 생성
@NoArgsConstructor // 기본 생성자 자동 생성
public class Store {

    /**
     * 가게 고유 ID (자동 생성)
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 가게 이름
    private String name;

    // 가게 주소
    private String address;

    // 가게 설명
    private String description;
}
