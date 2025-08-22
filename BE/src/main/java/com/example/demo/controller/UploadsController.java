package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadsController {

    private Path ensure(String dir) throws Exception {
        Path p = Paths.get("uploads", dir);
        Files.createDirectories(p);
        return p;
    }

    /** POST /api/v1/uploads/images  (form-data: file) */
    @PostMapping("/images")
    public Map<String, Object> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        Path dir = ensure("images");
        String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return Map.of(
                "url", "/uploads/images/" + filename,
                "filename", filename,
                "size", file.getSize(),
                "mimetype", file.getContentType()
        );
    }

    /** POST /api/v1/uploads/videos  (form-data: file) */
    @PostMapping("/videos")
    public Map<String, Object> uploadVideo(@RequestParam("file") MultipartFile file) throws Exception {
        Path dir = ensure("videos");
        String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return Map.of(
                "url", "/uploads/videos/" + filename,
                "filename", filename,
                "size", file.getSize(),
                "mimetype", file.getContentType()
        );
    }
}
