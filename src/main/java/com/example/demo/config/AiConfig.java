package com.example.demo.config;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

/**
 * AI 관련 설정을 담당하는 클래스
 * VertexAI 클라이언트와 GenerativeModel을 Spring Bean으로 등록하여 관리합니다.
 */
@Configuration
public class AiConfig {

    /**
     * VertexAI 클라이언트를 생성하고 Bean으로 등록합니다.
     * @param projectId Google Cloud 프로젝트 ID
     * @param location 리전 (예: asia-northeast3)
     * @return 초기화된 VertexAI 클라이언트
     * @throws IOException 클라이언트 생성 실패 시
     */
    @Bean
    public VertexAI vertexAI(@Value("${google.project.id}") String projectId,
                             @Value("${google.location}") String location) throws IOException {
        return new VertexAI(projectId, location);
    }

    /**
     * GenerativeModel(Gemini)을 생성하고 Bean으로 등록합니다.
     * @param vertexAI 위에서 생성된 VertexAI 클라이언트 Bean
     * @param modelName 사용할 모델 이름 (예: gemini-1.5-flash-001)
     * @return 초기화된 GenerativeModel
     */
    @Bean
    public GenerativeModel generativeModel(VertexAI vertexAI,
                                           @Value("${google.model.name}") String modelName) {
        return new GenerativeModel(modelName, vertexAI);
    }
}
