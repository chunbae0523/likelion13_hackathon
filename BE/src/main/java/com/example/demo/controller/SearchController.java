package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    @GetMapping
    public Map<String, Object> search(@RequestParam(defaultValue = "") String q,
                                      @RequestParam(defaultValue = "2") int limit) {
        int lim = Math.max(1, Math.min(100, limit));
        List<Map<String, Object>> items = new ArrayList<>();
        for (int i=0;i<lim;i++) {
            items.add(Map.of(
                    "id", "sr" + (i+1),
                    "type", i % 2 == 0 ? "post" : "store",
                    "title", q + " 결과 " + (i+1)
            ));
        }
        return Map.of("query", q, "items", items);
    }
}
