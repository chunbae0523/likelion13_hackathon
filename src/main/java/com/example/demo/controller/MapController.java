package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import static java.lang.Math.*;

/**
 * DB 없이 동작하는 Mock 컨트롤러
 *  - 지도 마커/목록, 검색(q), 카테고리, 페이징, 거리 계산 지원
 */
@RestController
@RequestMapping("/api/v1")
public class MapController {

    private static final String DEFAULT_REGION = "인천광역시";

    /* ====== 샘플 지점(인천 중심) ======
       디자인처럼 보이도록 thumbnail / address / tags 포함  */
    private static final List<Map<String, Object>> PLACES = List.of(
            place( 1L,"소문난 카페","cafe", 37.4477,126.7313,"인천광역시 연수구 135, 지상 1층",
                    "https://picsum.photos/seed/cafe1/240/160", 4.7, 1521, List.of("보드게임","와이파이","콘센트")),
            place( 2L,"연개소문 카페","cafe", 37.3993,126.6467,"인천광역시 연수구 동춘동 1층",
                    "https://picsum.photos/seed/cafe2/240/160", 4.5, 880, List.of("디저트","조용","스터디")),
            place( 3L,"소문이 머문 자리","cafe", 37.4276,126.6921,"인천광역시 연수구 청량대로 89, 지상 1층",
                    "https://picsum.photos/seed/cafe3/240/160", 4.6, 102, List.of("루프탑","포토존")),
            place( 4L,"문학야구장 푸드트럭","food", 37.4368,126.6987,"인천 미추홀구 매점거리",
                    "https://picsum.photos/seed/food1/240/160", 4.3, 412, List.of("핫도그","버거","콜라")),
            place( 5L,"소문마트 연수점","mart", 37.4102,126.6784,"인천 연수구 청학동 3-21",
                    "https://picsum.photos/seed/mart1/240/160", 4.2, 95, List.of("24시","주차")),
            place( 6L,"보드게임 카페 인천대","cafe", 37.3757,126.6321,"인천 연수구 송도동 123-4",
                    "https://picsum.photos/seed/board1/240/160", 4.8, 511, List.of("보드게임","단체석","예약")),
            place( 7L,"연수구민 축제","event", 37.4202,126.6929,"인천 연수구 중앙공원 일대",
                    "https://picsum.photos/seed/event1/240/160", 4.9, 201, List.of("행사","공연","푸드존")),
            place( 8L,"송도 맛집 거리","food", 37.3810,126.6563,"인천 연수구 송도국제도시",
                    "https://picsum.photos/seed/food2/240/160", 4.4, 1410, List.of("회","파스타","스테이크")),
            place( 9L,"카페 브리즈","cafe", 37.4681,126.7055,"인천 부평구 시장로 12",
                    "https://picsum.photos/seed/cafe4/240/160", 4.1, 320, List.of("드립","원두판매")),
            place(10L,"연수 도서관 플리마켓","event", 37.4164,126.6783,"연수도서관 앞마당",
                    "https://picsum.photos/seed/event2/240/160", 4.6, 77, List.of("벼룩시장","주말","체험")),
            place(11L,"스윗베이크","food", 37.4558,126.7088,"인천 미추홀구 주안동 222",
                    "https://picsum.photos/seed/food3/240/160", 4.7, 640, List.of("브런치","디저트")),
            place(12L,"하나로 마트 학익점","mart", 37.4415,126.6601,"인천 미추홀구 학익동",
                    "https://picsum.photos/seed/mart2/240/160", 4.0, 205, List.of("대형마트","주차","세일"))
    );

    /* 지역명 → 중심좌표(간단 버전) */
    private static final Map<String, double[]> REGION_CENTER = Map.of(
            "인천광역시", new double[]{37.4563, 126.7052},
            "서울특별시", new double[]{37.5665, 126.9780}
    );

    // ─────────────────────────────────────────────────────────────────────
    // [지도] 장소 목록 – 명세: /api/v1/map/stores?lat=&lng=&radius=3km  (마커 샘플)
    @GetMapping("/map/stores")
    public Map<String, Object> stores(@RequestParam double lat,
                                      @RequestParam double lng,
                                      @RequestParam(defaultValue = "3km") String radius) {
        // 상위 6개만 마커로
        var items = PLACES.stream().limit(6).map(p -> Map.of(
                "store_id", p.get("id"),
                "name", p.get("name"),
                "lat", p.get("lat"),
                "lng", p.get("lng")
        )).toList();
        return Map.of("items", items);
    }

    // [지도] 표시할 게시글 – 명세: /api/v1/map/posts?lat=&lng=
    @GetMapping("/map/posts")
    public Map<String, Object> posts(@RequestParam double lat, @RequestParam double lng) {
        return Map.of("items", List.of(
                Map.of("post_id", 101, "title", "근처 행사", "lat", lat + 0.01, "lng", lng + 0.01),
                Map.of("post_id", 102, "title", "신규 오픈 소식", "lat", lat - 0.008, "lng", lng - 0.006)
        ));
    }

    // ─────────────────────────────────────────────────────────────────────
    // [지도] 장소 목록(카테고리) – /api/v1/places/category=recommend
    @GetMapping("/places/category={category}")
    public ResponseEntity<?> placesByCategory(
            @PathVariable String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Integer seed,
            @RequestParam(required = false, name = "q") String query
    ) {
        // 기준점 결정(지역 우선, 없으면 좌표, 둘 다 없으면 DEFAULT_REGION)
        double[] center = centerOf(region, lat, lng);

        // 1) 카테고리 필터
        var filtered = PLACES.stream()
                .filter(p -> switch (category) {
                    case "recommend" -> true;
                    case "popular"  -> true;            // 정렬에서 인기 우선
                    case "event"    -> "event".equals(p.get("category"));
                    case "food"     -> "food".equals(p.get("category"));
                    case "cafe"     -> "cafe".equals(p.get("category"));
                    case "mart"     -> "mart".equals(p.get("category"));
                    default -> true;
                })
                // 2) 검색어 필터(q)
                .filter(p -> {
                    if (query == null || query.isBlank()) return true;
                    String q = query.toLowerCase();
                    String name = String.valueOf(p.get("name")).toLowerCase();
                    String addr = String.valueOf(p.get("address")).toLowerCase();
                    String tags = String.valueOf(p.get("tags")).toLowerCase();
                    return name.contains(q) || addr.contains(q) || tags.contains(q);
                })
                // 3) 거리 계산 붙이기
                .map(p -> attachDistance(p, center[0], center[1]))
                .toList();

        // 4) 정렬 규칙
        Comparator<Map<String, Object>> byDistance = Comparator.comparingDouble(m -> (double) m.get("distance_km"));
        Comparator<Map<String, Object>> byPopularity = Comparator
                .comparingDouble((Map<String, Object> m) -> (double) m.get("rating")).reversed()
                .thenComparingInt(m -> (int) m.get("reviews_count")).reversed();

        List<Map<String, Object>> sorted = new ArrayList<>(filtered);
        switch (category) {
            case "popular" -> sorted.sort(byPopularity.thenComparing(byDistance));
            case "event"   -> sorted.sort(byDistance); // 행사면 가까운 순
            default        -> {
                // recommend: 거리 + 약간의 랜덤(같은 seed면 동일)
                Random rnd = (seed == null) ? new Random() : new Random(seed);
                sorted.sort(Comparator
                        .comparingDouble((Map<String, Object> m) -> (double) m.get("distance_km"))
                        .thenComparingInt(m -> rnd.nextInt(1000)));
            }
        }

        // 5) 페이징
        int total = sorted.size();
        int from = Math.max(0, (page - 1) * limit);
        int to   = Math.min(total, from + limit);
        List<Map<String, Object>> pageItems = (from >= to) ? List.of() : sorted.subList(from, to);

        // 6) 응답(프론트가 쓰기 쉬운 키)
        Map<String, Object> body = Map.of(
                "region", (region == null || region.isBlank()) ? DEFAULT_REGION : region,
                "center", Map.of("lat", center[0], "lng", center[1]),
                "page", page,
                "limit", limit,
                "total", total,
                "items", pageItems
        );
        return ResponseEntity.ok(body);
    }

    // ─────────────────────────────────────────────────────────────────────
    // (선택) 지오코딩 – Mock으로 유지
    @GetMapping("/map/geocode/reverse")
    public ResponseEntity<?> reverse(@RequestParam Double lat, @RequestParam Double lng) {
        if (lat == null || lng == null) return ResponseEntity.badRequest().body(Map.of("error","lat,lng required"));
        // 아주 단순한 더미 주소
        return ResponseEntity.ok(Map.of("address", String.format("위도 %.4f, 경도 %.4f 근처", lat, lng)));
    }

    @GetMapping("/map/geocode/search")
    public ResponseEntity<?> forward(@RequestParam(name="q") String q) {
        if (q == null || q.isBlank()) return ResponseEntity.badRequest().body(Map.of("error","q (address) required"));
        // 인천/서울만 간단 매핑
        double[] c = REGION_CENTER.getOrDefault(q, REGION_CENTER.get(DEFAULT_REGION));
        return ResponseEntity.ok(List.of(Map.of("lat", c[0], "lng", c[1], "label", q)));
    }

    /* ================== 유틸/헬퍼 ================== */

    private static Map<String, Object> place(Long id, String name, String category,
                                             double lat, double lng, String address,
                                             String thumb, double rating, int reviews,
                                             List<String> tags) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", id);
        m.put("name", name);
        m.put("category", category);
        m.put("lat", lat);
        m.put("lng", lng);
        m.put("address", address);
        m.put("thumbnail", thumb);
        m.put("rating", rating);
        m.put("reviews_count", reviews);
        m.put("tags", String.join(",", tags));
        return m;
    }

    /** region/lat,lng 중 기준점 결정 */
    private static double[] centerOf(String region, Double lat, Double lng) {
        if (region != null && !region.isBlank()) {
            return REGION_CENTER.getOrDefault(region, REGION_CENTER.get(DEFAULT_REGION));
        }
        if (lat != null && lng != null) return new double[]{lat, lng};
        return REGION_CENTER.get(DEFAULT_REGION);
    }

    /** 거리(km) 계산 붙이기 */
    @SuppressWarnings("unchecked")
    private static Map<String, Object> attachDistance(Map<String, Object> p, double baseLat, double baseLng) {
        Map<String, Object> m = new HashMap<>(p);
        double d = haversineKm(baseLat, baseLng,
                (double) p.get("lat"), (double) p.get("lng"));
        m.put("distance_km", round1(d)); // 소수 1자리
        return m;
    }

    /** 하버사인 거리(km) */
    private static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0;
        double dLat = toRadians(lat2 - lat1);
        double dLon = toRadians(lon2 - lon1);
        double a = sin(dLat/2)*sin(dLat/2)
                + cos(toRadians(lat1))*cos(toRadians(lat2))*sin(dLon/2)*sin(dLon/2);
        double c = 2 * atan2(sqrt(a), sqrt(1-a));
        return R * c;
    }

    private static double round1(double v) { return Math.round(v * 10.0) / 10.0; }
}
