package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/** Azure OpenAI(DALL·E) 이미지 생성 서비스 (B방식 적용) */
@Service
public class AzureOpenAiService {

    @Value("${azure.openai.endpoint:}")
    private String endpoint;

    @Value("${azure.openai.key:}")
    private String apiKey;

    @Value("${azure.openai.apiVersion:2024-02-01}")
    private String apiVersion;

    @Value("${azure.openai.imageDeployment:}")
    private String deployment;

    private static final EnumSet<ImageSize> ALLOWED = EnumSet.allOf(ImageSize.class);
    private static final int   MAX_PROMPT       = 1500;
    private static final int   POLL_MAX_TRIES   = 20;
    private static final long  POLL_BASE_SLEEP  = 800L;

    private final RestTemplate rest;

    public AzureOpenAiService() {
        var f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(15_000);
        f.setReadTimeout(60_000);
        this.rest = new RestTemplate(f);
    }

    /** === 외부 노출 메서드 (컨트롤러에서 호출) === */
    public Map<String, Object> generatePromotionImage(String prompt, String sizeStr) {
        ImageSize sizeEnum = parseSize(sizeStr);  // String → enum
        return generatePromotionImageInternal(prompt, sizeEnum, false);
    }

    /** === 내부 공통 구현 === */
    private Map<String, Object> generatePromotionImageInternal(String prompt, ImageSize size, boolean transparentBg) {
        long t0 = System.currentTimeMillis();
        try {
            String ep = normalizeEndpoint();
            String p  = normalizePrompt(prompt) + "\n(밝고 친근함, 굵은 한글 타이포, 상업용 포스터 스타일)";
            ImageSize s = (size == null || !ALLOWED.contains(size)) ? ImageSize.S_1024 : size;

            Map<String, Object> result = submitAndPoll(ep, p, s.value, transparentBg);
            Map<?, ?> first = firstDatum(result);
            if (first == null) return error(500, "IMAGE_EMPTY", "no image returned");

            String imageUrl = null;
            if (first.get("url") instanceof String url && StringUtils.hasText(url)) {
                imageUrl = url;
            } else if (first.get("b64_json") instanceof String b64 && StringUtils.hasText(b64)) {
                imageUrl = "data:image/png;base64," + b64;
            } else {
                return error(500, "IMAGE_FORMAT_UNKNOWN", "unknown image format");
            }

            Map<String, Object> ok = new LinkedHashMap<>();
            ok.put("imageUrl", imageUrl);
            ok.put("provider", "azure-openai");
            ok.put("deployment", deployment);
            ok.put("request_id", UUID.randomUUID().toString());
            ok.put("duration_ms", System.currentTimeMillis() - t0);
            return ok;

        } catch (IllegalStateException e) {
            return error(401, "NO_AZURE_CONFIG", e.getMessage());
        } catch (ImageGenException e) {
            return error(502, "IMAGE_GEN_FAILED", e.getMessage());
        } catch (Exception e) {
            return error(500, "IMAGE_GEN_FAILED", e.getMessage());
        }
    }

    /** === 내부 유틸 === */
    private ImageSize parseSize(String sizeStr) {
        if (!StringUtils.hasText(sizeStr)) return ImageSize.S_1024;
        String t = sizeStr.trim().toLowerCase();
        if (t.contains("1024")) return ImageSize.S_1024;
        if (t.contains("256"))  return ImageSize.S_256;
        return ImageSize.S_512;
    }

    private String normalizeEndpoint() {
        String ep = (endpoint == null ? "" : endpoint).replaceAll("/+$", "");
        if (!StringUtils.hasText(ep)) throw new IllegalStateException("endpoint missing");
        if (!StringUtils.hasText(apiKey)) throw new IllegalStateException("apiKey missing");
        if (!StringUtils.hasText(deployment)) throw new IllegalStateException("imageDeployment missing");
        return ep;
    }

    private String normalizePrompt(String prompt) {
        String p = (prompt == null ? "" : prompt).trim();
        if (p.length() > MAX_PROMPT) p = p.substring(0, MAX_PROMPT);
        if (!StringUtils.hasText(p)) throw new ImageGenException("prompt is required");
        return p;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> submitAndPoll(String ep, String prompt, String size, boolean transparentBg) {
        String submitUrl = ep + "/openai/deployments/" + deployment +
                "/images/generations:submit?api-version=" + apiVersion;

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("prompt", prompt);
        body.put("size", size);
        body.put("n", 1);
        if (transparentBg) body.put("background", "transparent");

        HttpHeaders h = new HttpHeaders();
        h.set("api-key", apiKey);
        h.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map<String, Object>> submit;
        try {
            submit = rest.exchange(
                    submitUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(body, h),
                    new ParameterizedTypeReference<>() {});
        } catch (RestClientResponseException e) {
            throw new ImageGenException("submit failed: " + e.getRawStatusCode() + " " + e.getResponseBodyAsString());
        }

        Map<String, Object> submitData = submit.getBody();
        Object result = submitData == null ? null : submitData.get("result");
        String opId   = submitData == null ? null : (String) submitData.get("id");

        if (result == null && StringUtils.hasText(opId)) {
            String opUrl = ep + "/openai/operations/" + opId + "?api-version=" + apiVersion;

            long sleep = POLL_BASE_SLEEP;
            for (int i = 0; i < POLL_MAX_TRIES; i++) {
                sleepQuietly(sleep);
                sleep = Math.min(sleep * 2, 4_000L);

                HttpHeaders h2 = new HttpHeaders();
                h2.set("api-key", apiKey);

                ResponseEntity<Map<String, Object>> op = rest.exchange(
                        opUrl, HttpMethod.GET, new HttpEntity<>(h2),
                        new ParameterizedTypeReference<>() {});
                Map<String, Object> opBody = op.getBody();

                String status = opBody == null ? null : (String) opBody.get("status");
                if ("succeeded".equals(status)) {
                    result = opBody.get("result");
                    break;
                }
                if ("failed".equals(status) || "cancelled".equals(status)) {
                    throw new ImageGenException("operation " + status);
                }
            }
            if (result == null) throw new ImageGenException("operation timeout");
        }

        if (!(result instanceof Map<?, ?> rm)) throw new ImageGenException("IMAGE_EMPTY");
        return (Map<String, Object>) rm;
    }

    private static void sleepQuietly(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }

    private Map<?, ?> firstDatum(Map<String, Object> result) {
        Object data = result.get("data");
        if (!(data instanceof List<?> list) || list.isEmpty()) return null;
        Object first = list.get(0);
        return (first instanceof Map<?, ?> m) ? m : null;
    }

    private static Map<String, Object> error(int http, String code, String message) {
        Map<String, Object> m = new LinkedHashMap<>();
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("code", code);
        e.put("message", message);
        m.put("error", e);
        m.put("_http", http);
        return m;
    }

    /** 허용 사이즈 enum */
    public enum ImageSize {
        S_256("256x256"), S_512("512x512"), S_1024("1024x1024");
        public final String value;
        ImageSize(String v){ this.value = v; }
    }

    /** 도메인 예외 */
    public static class ImageGenException extends RuntimeException {
        public ImageGenException(String m){ super(m); }
    }
}
