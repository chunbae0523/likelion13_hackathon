package com.example.demo.repository;

import com.example.demo.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    /**
     * 주소(address)에 특정 문자열(location)이 포함된 가게들을 찾는 메소드
     * 예: location이 "서울"이면, 주소에 "서울"이 들어간 모든 가게를 찾아옵니다.
     */
    List<Store> findByAddressContaining(String location);
}
