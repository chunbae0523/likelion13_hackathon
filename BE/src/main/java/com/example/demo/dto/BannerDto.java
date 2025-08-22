package com.example.demo.dto;

import com.example.demo.entity.Store;
import lombok.Getter;

/**
 * 배너에 보여줄 가게 정보를 담는 DTO
 */
@Getter
public class BannerDto {
    private final Long storeId;
    private final String storeName;

    public BannerDto(Store store) {
        this.storeId = store.getId();
        this.storeName = store.getName();
    }
}
