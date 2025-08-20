package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자(회원) 관련 API 컨트롤러
 * 모든 주소는 /api/v1/users 로 시작합니다.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    // 실제 사용자 관련 로직을 처리하는 서비스
    private final UserService userService;

    /**
     * 회원가입
     * @param userDto 사용자가 입력한 username, password가 담긴 객체
     * @return 성공/실패 메시지
     *
     * 호출 예시: POST /api/v1/users
     * Body(JSON): { "username": "newuser", "password": "password123" }
     */
    @PostMapping
    public ResponseEntity<String> register(@RequestBody UserDto userDto) {
        try {
            // 서비스에게 회원가입 처리를 요청
            userService.register(userDto.username(), userDto.password());
            // 성공 시 201 Created 응답
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
        } catch (IllegalArgumentException e) {
            // 이미 존재하는 아이디일 경우 409 Conflict 에러
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * 로그인
     * @param userDto 사용자가 입력한 username, password가 담긴 객체
     * @param session 로그인 성공 시 사용자 정보를 저장할 세션
     * @return 성공/실패 메시지
     *
     * 호출 예시: POST /api/v1/users/login
     * Body(JSON): { "username": "newuser", "password": "password123" }
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto, HttpSession session) {
        // 서비스에게 로그인 처리를 요청
        return userService.login(userDto.username(), userDto.password())
                .map(user -> {
                    // 성공하면 세션에 사용자 ID를 저장
                    session.setAttribute("userId", user.getId());
                    return ResponseEntity.ok("로그인 성공");
                })
                // 실패하면 401 Unauthorized 에러
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 틀렸습니다."));
    }

    /**
     * 로그아웃
     * @param session 무효화시킬 현재 세션
     * @return 성공 메시지
     *
     * 호출 예시: POST /api/v1/users/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        // 현재 세션을 파기하여 로그아웃 처리
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

    /**
     * 회원 탈퇴
     * @param session 로그인한 사용자 정보를 확인하기 위함
     * @return 성공/실패 메시지
     *
     * 호출 예시: DELETE /api/v1/users/me
     */
    @DeleteMapping("/me")
    public ResponseEntity<String> withdraw(HttpSession session) {
        // 세션에서 현재 로그인한 사용자의 ID를 가져옴
        Long userId = (Long) session.getAttribute("userId");
        // 로그인이 안 되어있으면 401 Unauthorized 에러
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        // 서비스에게 회원 탈퇴 처리를 요청
        userService.withdraw(userId);
        // 세션을 파기
        session.invalidate();
        return ResponseEntity.ok("회원 탈퇴 성공");
    }
}
