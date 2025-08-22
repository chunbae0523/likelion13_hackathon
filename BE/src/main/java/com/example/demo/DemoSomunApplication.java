package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// com.example.app.* 아래까지 컴포넌트 스캔
// com.example.app.* 아래까지 컴포넌트 스캔
@SpringBootApplication(scanBasePackages = {
		"com.example.demo",
		"com.example.app"
})
public class DemoSomunApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoSomunApplication.class, args);
	}
}