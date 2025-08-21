package com.example.demo.service;

import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 가게 관련 실제 비즈니스 로직을 처리하는 서비스 (주방장)
 */
@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final StoreFollowRepository storeFollowRepository;

    /** 가게 1개 정보 조회 로직 */
    @Transactional(readOnly = true)
    public Store getStoreInfo(Long storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));
    }

    /** 특정 가게에 작성된 모든 게시물 목록 조회 로직 */
    @Transactional(readOnly = true)
    public List<PostResponseDto> getPostsByStore(Long storeId) {
        return postRepository.findAllByStoreId(storeId).stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    /** 가게 팔로우 로직 */
    @Transactional
    public void followStore(Long userId, Long storeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));

        if (storeFollowRepository.findByUserAndStore(user, store).isPresent()) {
            throw new IllegalStateException("이미 팔로우한 가게입니다.");
        }
        storeFollowRepository.save(new StoreFollow(user, store));
    }

    /** 가게 팔로우 취소 로직 */
    @Transactional
    public void unfollowStore(Long userId, Long storeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new IllegalArgumentException("가게를 찾을 수 없습니다."));

        StoreFollow follow = storeFollowRepository.findByUserAndStore(user, store)
                .orElseThrow(() -> new IllegalStateException("팔로우하지 않은 가게입니다."));
        storeFollowRepository.delete(follow);
    }
}
