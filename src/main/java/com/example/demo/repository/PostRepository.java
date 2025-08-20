package com.example.demo.repository;

import com.example.demo.entity.Post;
import com.example.demo.entity.Store;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // ... 기존에 있던 다른 메소드들 ...
    List<Post> findAllByAuthor_Id(Long userId);
    List<Post> findAllByStoreId(Long storeId);

    /**
     * 여러 가게(stores) 목록에 포함된 게시물들을 최신순으로 조회하는 메소드
     * @param stores 가게 정보가 담긴 리스트
     * @param pageable 개수 제한(limit)을 위한 객체
     */
    List<Post> findByStoreInOrderByCreatedAtDesc(List<Store> stores, Pageable pageable);
}
