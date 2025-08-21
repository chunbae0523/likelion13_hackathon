package com.example.demo.service;

import com.example.demo.dto.PostCreateRequestDto;
import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostScrapRepository postScrapRepository;

    // 게시물 생성
    @Transactional
    public Post createPost(PostCreateRequestDto requestDto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Store store = (requestDto.getStoreId() != null) ? storeRepository.findById(requestDto.getStoreId()).orElse(null) : null;
        Post post = new Post(requestDto.getTitle(), requestDto.getContent(), user, store);
        return postRepository.save(post);
    }

    // 게시물 목록 조회
    @Transactional(readOnly = true)
    public List<PostResponseDto> getPosts(String sort, int limit) {
        Sort sortOrder = "new".equals(sort) ? Sort.by(Sort.Direction.DESC, "createdAt") : Sort.by(Sort.Direction.DESC, "likeCount");
        PageRequest pageable = PageRequest.of(0, limit, sortOrder);
        return postRepository.findAll(pageable).stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    // 게시물 상세 보기 (조회수 증가 포함)
    @Transactional
    public PostDetailResponseDto getPostDetails(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.setViewCount(post.getViewCount() + 1);
        return new PostDetailResponseDto(post);
    }

    // 좋아요
    @Transactional
    public void likePost(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        if (postLikeRepository.findByUserAndPost(user, post).isPresent()) {
            throw new IllegalStateException("이미 좋아요를 누른 게시물입니다.");
        }
        postLikeRepository.save(new PostLike(user, post));
        post.setLikeCount(post.getLikeCount() + 1);
    }

    // 스크랩
    @Transactional
    public void scrapPost(Long userId, Long postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        if (postScrapRepository.findByUserAndPost(user, post).isPresent()) {
            throw new IllegalStateException("이미 스크랩한 게시물입니다.");
        }
        postScrapRepository.save(new PostScrap(user, post));
        post.setScrapCount(post.getScrapCount() + 1);
    }
}