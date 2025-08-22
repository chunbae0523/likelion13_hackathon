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

/**
 * 홈 화면 관련 실제 비즈니스 로직을 처리하는 서비스 (주방장)
 */
@Service
@RequiredArgsConstructor
public class HomeService {

    private final StoreRepository storeRepository;
    private final PostRepository postRepository;

    /** 홈 화면 데이터 (배너 + 위치 기반 게시물) 조회 로직 */
    @Transactional(readOnly = true)
    public HomeResponseDto getHomeFeed(String location, int limit, int bannerLimit) {

        // 1. 배너에 보여줄 가게 정보를 bannerLimit 개수만큼 조회
        List<Store> bannerStores = storeRepository.findAll(PageRequest.of(0, bannerLimit)).getContent();
        List<BannerDto> banners = bannerStores.stream()
                .map(BannerDto::new)
                .collect(Collectors.toList());

        // 2. 파라미터로 받은 location(지역)에 해당하는 가게들을 검색
        List<Store> locationStores = storeRepository.findByAddressContaining(location);

        // 3. 해당 가게들의 최신 게시물을 limit 개수만큼 조회
        List<Post> posts = postRepository.findByStoreInOrderByCreatedAtDesc(locationStores, PageRequest.of(0, limit));
        List<PostResponseDto> postDtos = posts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());

        // 4. 배너와 게시물 목록을 합쳐서 최종 응답 생성
        return new HomeResponseDto(banners, postDtos);
    }
}
