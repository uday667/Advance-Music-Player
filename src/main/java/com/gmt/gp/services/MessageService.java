package com.gmt.gp.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gmt.gp.model.Message;
import com.gmt.gp.repositories.MessageRepository;
import com.gmt.gp.util.GP_CONSTANTS;

@Service
public class MessageService {

    private static final String BUILD_STATUS = "BUILD_STATUS";

    private static final String MUSIC_PATH = "MUSIC_PATH";

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMaMessage(Message message) {
        return messageRepository.save(message);
    }

    public Message getMessageBYId(long messageId) {
        return messageRepository.getByMessageId(messageId);
    }

    public Message getMessageByName(String messageName) {
        try {
            return messageRepository.getByName(messageName);
        } catch (Exception e) {
            if (e.getMessage().contains("query did not return a unique result")) {
                if (messageName.equals(GP_CONSTANTS.LAST_PLAYED_SONG_ID)) {
                    removeMessageName(messageName);
                }
            }
        }
        return null;
    }

    public List<Message> getMessagesByType(String messageType) {
        return messageRepository.getByType(messageType);
    }

    public Message getMessageByValue(String messageValue) {
        return messageRepository.getByValue(messageValue);
    }

    public void removeMessageById(long messageId) {
        messageRepository.deleteById(messageId);
    }

    public void removeMessageType(String type) {
        List<Message> msgTypes = messageRepository.getByType(type);
        for (Message msg : msgTypes)
            removeMessageById(msg.getMessageId());
    }

    public void removeMessageName(String name) {
        List<Message> msgs = messageRepository.findByName(name);
        if (msgs != null && msgs.size() > 0) {
            for (Message msg : msgs) {
                removeMessageById(msg.getMessageId());
            }
        }
    }

    // Music Path - start

    public List<String> getAllMusicPaths(boolean valuesOnly) {
        List<Message> mainFolderListMessage = getAllMusicPaths();
        List<String> mainFolderList = null;
        if (mainFolderListMessage != null && mainFolderListMessage.size() > 0) {
            mainFolderList = mainFolderListMessage.stream().map(message -> message.getValue()).toList();
        }
        return mainFolderList;

    }

    public List<Message> getAllMusicPaths() {
        return messageRepository.getByType(MUSIC_PATH);
    }

    public Message saveMusicPath(Message message) {
        return messageRepository.save(message);
    }
    // Music Path - end

    // Build status - start
    public void updateBuildStatus(String type, String name, String value) {
        Message message = messageRepository.getByName(name);
        if (message == null) {
            message = new Message(type, name, value);
        } else {
            message.setValue(value);
        }
        messageRepository.save(message);
    }

    public List<Message> getbuldStatus() {
        return messageRepository.getByType(BUILD_STATUS);
    }
    // Build status - end

    public void deleteAll(List<Message> prevDownloadStatus) {
        messageRepository.deleteAll(prevDownloadStatus);
    }

    public List<Message> saveAll(List<Message> downloadStatusList) {
        return (List<Message>) messageRepository.saveAll(downloadStatusList);
    }
}
