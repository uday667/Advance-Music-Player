package com.gmt.gp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.Message;
import com.gmt.gp.services.MessageService;

@RestController
@RequestMapping("/message")
@CrossOrigin
public class MessageController {

    private static final String FAILED = "FAILED";

    private static final String SUCCESS = "SUCCESS";

    @Autowired
    private MessageService messageService;

    @GetMapping("/{message-name}")
    public Message getMessageByName(@PathVariable String messageName) {
        return messageService.getMessageByName(messageName);
    }

    @GetMapping("/type/{messageType}")
    public List<Message> getMessageByType(@PathVariable String messageType) {
        return messageService.getMessagesByType(messageType);
    }

    @PostMapping("/save-message")
    public Message saveMessage(@RequestBody Message message) {
        return messageService.saveMaMessage(message);
    }

    @PostMapping("/save-music-path")
    public Message saveMusicPath(@RequestBody Message message) {
        return messageService.saveMusicPath(message);
    }

    @RequestMapping("/music-paths")
    public List<Message> getAllMusicPaths() {
        return messageService.getAllMusicPaths();
    }

    @DeleteMapping("/remove-music-path/{messageId}")
    public GPResponse removeMusicPath(@PathVariable String messageId) {
        GPResponse resp = new GPResponse(FAILED, null, null);
        try {
            messageService.removeMessageById(Long.parseLong(messageId));
            resp.setStatus(SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resp;
    }

    @RequestMapping("/build-status")
    public List<Message> getBuildStatus() {
        return messageService.getbuldStatus();
    }

}
