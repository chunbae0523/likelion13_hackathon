package com.example.demo.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

/** 데모용: 매 요청에 userId=1 을 심어줌 */
@Component
public class FakeAuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        request.setAttribute("userId", 1L); // mypage.js의 req.user.id 대체
        chain.doFilter(request, response);
    }
}
