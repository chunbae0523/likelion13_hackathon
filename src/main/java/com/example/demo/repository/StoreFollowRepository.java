package com.example.demo.repository;

import com.example.demo.entity.StoreFollow;
import com.example.demo.entity.User;
import com.example.demo.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StoreFollowRepository extends JpaRepository<StoreFollow, Long> {
    Optional<StoreFollow> findByUserAndStore(User user, Store store);
}