package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PlacesService {

    @Value("${google.maps.apikey:}")
    private String googleApiKey;

    private final RestTemplate rest = new RestTemplate();

    /** 주소 → 좌표 (forwardGeocode) */
    public Map<String, Object> forwardGeocode(String q) {
        if (!StringUtils.hasText(googleApiKey)) return Map.of("error","NO_GOOGLE_KEY");
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address={q}&key={key}";
        Map resp = rest.getForObject(url, Map.class, q, googleApiKey);
        return resp == null ? Map.of() : resp;
    }

    /** 좌표 → 주소 (reverseGeocode) */
    public Map<String, Object> reverseGeocode(double lat, double lng) {
        if (!StringUtils.hasText(googleApiKey)) return Map.of("error","NO_GOOGLE_KEY");
        String url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={key}";
        Map resp = rest.getForObject(url, Map.class, lat, lng, googleApiKey);
        return resp == null ? Map.of() : resp;
    }

    /** 추천/인기/카테고리 리스트 생성 (더미) */
    public Map<String, Object> buildPlaceList(String category, Double lat, Double lng,
                                              String region, int page, int limit, Integer seed) {
        Random r = new Random(seed == null ? 42 : seed);
        List<Map<String, Object>> items = new ArrayList<>();
        for (int i=0;i<limit;i++) {
            items.add(Map.of(
                    "store_id", page*100 + i,
                    "name", category + " 매장 " + (i+1),
                    "address", region != null ? region + " 어딘가" : "좌표(" + lat + "," + lng + ")",
                    "score", 3 + r.nextInt(3)
            ));
        }
        return Map.of(
                "category", category,
                "page", page,
                "limit", limit,
                "items", items
        );
    }

    /** ✅ 신규 오버로드: 검색어(q)까지 받는 버전 */
    @SuppressWarnings("unchecked")
    public Map<String, Object> buildPlaceList(
            String category,
            Double lat, Double lng,
            String region,
            int page, int limit,
            Integer seed,
            String q
    ) {
        // 1) 우선 기존 메서드로 기본 결과 생성
        Map<String, Object> out = new HashMap<>(buildPlaceList(category, lat, lng, region, page, limit, seed));

        // 2) q 없으면 그대로 반환
        if (q == null || q.isBlank()) return out;

        String kw = q.trim().toLowerCase();

        // 3) items 꺼내 필터링 (name/address/tags 기준: 키 이름은 프로젝트에 맞게 조정)
        Object itemsObj = out.get("items");
        if (itemsObj instanceof List<?>) {
            List<?> raw = (List<?>) itemsObj;
            List<Map<String, Object>> filtered = new ArrayList<>();

            for (Object o : raw) {
                if (!(o instanceof Map)) continue;
                Map<String, Object> m = (Map<String, Object>) o;

                String name = String.valueOf(m.getOrDefault("name", ""));
                String addr = String.valueOf(m.getOrDefault("address", ""));
                String tags = String.valueOf(m.getOrDefault("tags", "")); // 없으면 빈문자열

                if (name.toLowerCase().contains(kw)
                        || addr.toLowerCase().contains(kw)
                        || tags.toLowerCase().contains(kw)) {
                    filtered.add(m);
                }
            }

            out.put("items", filtered);
            out.put("total", filtered.size()); // 총개수 키가 있다면 갱신
        }

        // 필요하면 정렬/페이지네이션 재적용 가능(간단 구현이면 생략)
        return out;
    }
}
