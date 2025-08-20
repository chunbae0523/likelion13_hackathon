package com.example.demo.service;

import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<PostResponseDto> getPosts(String sort, int limit) {
        // '커서' 대신, 더 간단하고 표준적인 Pageable 객체를 사용하여 정렬 및 개수 제한을 처리합니다.
        Sort sortOrder = "new".equals(sort) ?
                Sort.by(Sort.Direction.DESC, "createdAt") :
                Sort.by(Sort.Direction.DESC, "likeCount");

        Pageable pageable = PageRequest.of(0, limit, sortOrder);

        // Pageable을 사용하여 게시물을 조회합니다.
        List<Post> posts = postRepository.findAll(pageable).getContent();

        return posts.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostDetailResponseDto getPostDetails(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. ID: " + postId));
        return new PostDetailResponseDto(post);
    }
}
