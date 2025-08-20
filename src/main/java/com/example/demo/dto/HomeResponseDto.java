package com.example.demo.dto;

import lombok.Getter;
import java.util.List;

/**
 * 홈 화면 전체 응답을 담는 DTO
 */
@Getter
public class HomeResponseDto {
    private final List<BannerDto> banners;
    private final List<PostResponseDto> posts;

    public HomeResponseDto(List<BannerDto> banners, List<PostResponseDto> posts) {
        this.banners = banners;
        this.posts = posts;
    }
}
