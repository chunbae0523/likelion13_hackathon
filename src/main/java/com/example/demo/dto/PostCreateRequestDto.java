package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 게시물 생성 시 프론트엔드에서 보낼 데이터 형식
 */
@Getter
@Setter
public class PostCreateRequestDto {
    private String title;
    private String content;
    private Long storeId;
}
