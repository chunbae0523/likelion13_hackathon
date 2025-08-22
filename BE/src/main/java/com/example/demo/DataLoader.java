package com.example.demo;

import com.example.demo.entity.Post;
import com.example.demo.entity.Store;
import com.example.demo.entity.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.StoreRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 테스트용 데이터를 자동으로 생성하는 클래스
 */
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final PostRepository postRepository;

    @Override
    public void run(String... args) throws Exception {
        // 테스트용 사용자 생성
        User testUser = userRepository.save(new User("testuser", "password"));

        // 테스트용 가게 데이터 생성
        Store store1 = new Store();
        store1.setName("서울 맛집");
        store1.setAddress("서울시 강남구");
        storeRepository.save(store1);

        Store store2 = new Store();
        store2.setName("부산 국밥");
        store2.setAddress("부산시 해운대구");
        storeRepository.save(store2);

        Store store3 = new Store();
        store3.setName("제주 흑돼지");
        store3.setAddress("제주시 애월읍");
        storeRepository.save(store3);

        // 테스트용 게시물 데이터 생성
        postRepository.save(new Post("강남역 최고의 파스타!", "정말 맛있어요.", testUser, store1));
        postRepository.save(new Post("해운대 시장 후기", "국밥이 끝내줍니다.", testUser, store2));
    }
}
