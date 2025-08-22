package com.example.demo.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    private final FakeAuthFilter fakeAuthFilter;
    public FilterConfig(FakeAuthFilter fakeAuthFilter) {
        this.fakeAuthFilter = fakeAuthFilter;
    }

    @Bean
    public FilterRegistrationBean<FakeAuthFilter> fakeAuthFilterRegistration() {
        var reg = new FilterRegistrationBean<FakeAuthFilter>();
        reg.setFilter(fakeAuthFilter);      // 빈으로 주입된 인스턴스 사용
        reg.addUrlPatterns("/*");
        reg.setOrder(1);
        return reg;
    }
}

