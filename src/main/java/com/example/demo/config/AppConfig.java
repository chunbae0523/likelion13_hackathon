package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * 애플리케이션의 전반적인 설정을 담당하는 클래스
 */
@Configuration
public class AppConfig {

    /**
     * 외부 API를 호출할 때 사용할 RestTemplate을 Bean으로 등록합니다.
     * 이렇게 해두면 다른 서비스에서 @RequiredArgsConstructor를 통해 쉽게 주입받아 사용할 수 있습니다.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
