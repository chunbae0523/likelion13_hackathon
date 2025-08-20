package com.example.demo.service;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        User user = new User(username, password);
        return userRepository.save(user);
    }

    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password));
    }

    @Transactional
    public void withdraw(Long userId) {
        // 사용자가 작성한 게시글의 작성자 정보를 null로 변경
        List<Post> userPosts = postRepository.findAllByAuthorId(userId);
        for (Post post : userPosts) {
            post.setAuthor(null);
        }
        postRepository.saveAll(userPosts);

        // 사용자 삭제
        userRepository.deleteById(userId);
    }
}
