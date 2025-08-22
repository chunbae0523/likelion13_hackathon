package com.example.demo.service;

// PostCreateRequestDto import는 이제 필요 없으므로 삭제합니다.
import com.example.demo.dto.PostDetailResponseDto;
import com.example.demo.dto.PostResponseDto;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
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
    private final UserRepository userRepository;
    // StoreRepository는 createPost에서만 사용되었으므로 제거해도 됩니다.
    // private final StoreRepository storeRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostScrapRepository postScrapRepository;

    // --- createPost 메소드는 다른 팀원이 구현했으므로 여기서 제거합니다. ---

    // ... (getPosts, getPostDetails, likePost, scrapPost 등 나머지 메소드는 그대로 유지) ...
    @Transactional(readOnly = true)
    public List<PostResponseDto> getPosts(String sort, int limit) {
        Sort sortOrder = "new".equals(sort) ? Sort.by(Sort.Direction.DESC, "createdAt") : Sort.by(Sort.Direction.DESC, "likeCount");
        Pageable pageable = PageRequest.of(0, limit, sortOrder);
        return postRepository.findAll(pageable).stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDetailResponseDto getPostDetails(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.setViewCount(post.getViewCount() + 1);
        return new PostDetailResponseDto(post);
    }

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
