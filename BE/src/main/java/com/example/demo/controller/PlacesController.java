package com.example.demo.controller;

import com.example.demo.service.PlacesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/places")
public class PlacesController {

    private final PlacesService places;
    public PlacesController(PlacesService places) { this.places = places; }

    /**
     * GET /api/v1/places
     * query: category(recommend|popular|event|food|cafe|mart, default recommend)
     *        lat,lng or region
     *        page(1), limit(3), seed(optional)
     */
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "recommend") String category,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String region,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int limit,
            @RequestParam(required = false) Integer seed
    ) {
        if ((lat == null || lng == null) && (region == null || region.isBlank())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error","lat,lng 또는 region 중 하나는 필요합니다."));
        }
        return ResponseEntity.ok(places.buildPlaceList(category, lat, lng, region, page, limit, seed));
    }
}
