package com.gmt.gp.services;

import java.io.IOException;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class GPEventListener {

    @EventListener(ApplicationReadyEvent.class)
    public void runAppInBrowser() {
        try {
            Runtime rt = Runtime.getRuntime();
            String url = "http://localhost:8085/#/music";
            rt.exec("rundll32 url.dll,FileProtocolHandler " + url);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
