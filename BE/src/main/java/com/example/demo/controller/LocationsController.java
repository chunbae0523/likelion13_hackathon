package com.example.app.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/locations")
public class LocationsController {

    // ---- Mock 데이터 ----
    static class Item {
        public String id;
        public String name;
        Item(String i, String n) { id = i; name = n; }
    }

    // 시/도
    private static final List<Item> SIDOS = new ArrayList<>(List.of(
            new Item("11", "서울특별시"),
            new Item("26", "부산광역시"),
            new Item("28", "인천광역시"),
            new Item("27", "대구광역시"),
            new Item("29", "광주광역시"),
            new Item("41", "용인시"),
            new Item("42", "수원시")
    ));

    // 구/군
    private static final Map<String, List<Item>> GUGUNS = new HashMap<>(Map.of(
            "11", List.of(new Item("110", "강남구"), new Item("140", "송파구")),
            "26", List.of(new Item("260", "해운대구")),
            "28", List.of(
                    new Item("281", "남동구"),
                    new Item("282", "연수구"),
                    new Item("283", "서구"),
                    new Item("284", "미추홀구")
            )
    ));

    // 동
    private static final Map<String, List<Item>> DONGS = new HashMap<>(Map.of(
            "110", List.of(new Item("1101", "역삼동"), new Item("1102", "대치동")),
            "140", List.of(new Item("1401", "잠실동")),
            "260", List.of(new Item("2601", "우동"))
            // 필요하다면 인천 구/군 아래 동도 추가 가능
    ));

    // GET /api/v1/locations/sido
    @GetMapping("/sido")
    public Map<String, Object> sido() {
        return Map.of("items", toMapList(SIDOS));
    }

    // GET /api/v1/locations/sido/{sidoId}/gugun
    @GetMapping("/sido/{sidoId}/gugun")
    public Map<String, Object> gugun(@PathVariable String sidoId) {
        List<Item> list = GUGUNS.getOrDefault(sidoId, List.of());
        return Map.of("sidoId", sidoId, "items", toMapList(list));
    }

    // GET /api/v1/locations/gugun/{gugunId}/dong
    @GetMapping("/gugun/{gugunId}/dong")
    public Map<String, Object> dong(@PathVariable String gugunId) {
        List<Item> list = DONGS.getOrDefault(gugunId, List.of());
        return Map.of("gugunId", gugunId, "items", toMapList(list));
    }

    // GET /api/v1/locations/search?keyword=서울특별시
    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam(required = false, defaultValue = "") String keyword) {
        String q = keyword.trim();
        if (q.isEmpty()) return Map.of("items", List.of());

        List<Map<String, Object>> result = new ArrayList<>();

        // sido
        for (Item s : SIDOS) {
            if (s.name.contains(q))
                result.add(Map.of("type", "sido", "sidoId", s.id, "label", s.name));
        }
        // gugun
        for (var e : GUGUNS.entrySet()) {
            String sidoId = e.getKey();
            for (Item g : e.getValue()) {
                if (g.name.contains(q))
                    result.add(Map.of("type", "gugun", "sidoId", sidoId, "gugunId", g.id, "label", g.name));
            }
        }
        // dong
        for (var e : DONGS.entrySet()) {
            String gugunId = e.getKey();
            for (Item d : e.getValue()) {
                if (d.name.contains(q))
                    result.add(Map.of("type", "dong", "gugunId", gugunId, "dongId", d.id, "label", d.name));
            }
        }
        return Map.of("items", result);
    }

    private List<Map<String, String>> toMapList(List<Item> items) {
        List<Map<String, String>> list = new ArrayList<>();
        for (Item it : items) list.add(Map.of("id", it.id, "name", it.name));
        return list;
    }
}
