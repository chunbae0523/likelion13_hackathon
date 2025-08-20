package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String content;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User author;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "store_id") private Store store;
    private LocalDateTime createdAt = LocalDateTime.now();
    private int likeCount = 0;
}