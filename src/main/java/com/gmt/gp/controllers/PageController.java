package com.gmt.gp.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PageController {
    @GetMapping({ "/", "" })
    public ResponseEntity<String> serveApp() throws IOException {
        Resource resource = new ClassPathResource("gp_react/index.html");
        InputStream inputStream = resource.getInputStream();
        String appHtml = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        return ResponseEntity.ok().body(appHtml);
    }
}
