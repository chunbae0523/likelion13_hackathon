package com.example.demo.service;

import com.example.demo.dto.BannerDto;
import com.example.demo.dto.HomeResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.Post;
import com.example.demo.entity.Store;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final StoreRepository storeRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public HomeResponseDto getHomeFeed(String location, int limit, int bannerLimit) {

        // 1. 배너에 들어갈 가게 정보 조회
        //    (간단하게 ID 순서대로 bannerLimit 개수만큼 가져옵니다)
        List<Store> bannerStores = storeRepository.findAll(PageRequest.of(0, bannerLimit)).getContent();
        List<BannerDto> banners = bannerStores.stream()
                .map(BannerDto::new)
                .collect(Collectors.toList());

        // 2. 위치(location) 기반으로 가게들 검색
        List<Store> locationStores = storeRepository.findByAddressContaining(location);

        // 3. 검색된 가게들에 작성된 최신 게시물들을 limit 개수만큼 조회
        List<Post> posts = postRepository.findByStoreInOrderByCreatedAtDesc(locationStores, PageRequest.of(0, limit));
        List<PostResponseDto> postDtos = posts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());

        // 4. 배너와 게시물들을 합쳐서 최종 응답 DTO 생성
        return new HomeResponseDto(banners, postDtos);
    }
}
