package com.example.demo.repository;

import com.example.demo.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Spring Data JPA가 자동으로 만들 수 있는 간단한 쿼리 메소드만 남깁니다.
    List<Post> findTop10ByOrderByCreatedAtDesc();
    List<Post> findTop10ByOrderByLikeCountDesc();
    List<Post> findAllByStoreId(Long storeId);
    List<Post> findAllByAuthorId(Long userId);
}
