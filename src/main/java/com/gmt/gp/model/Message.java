package com.gmt.gp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long messageId;
    private String name;
    private String value;
    private String type;

    public long getMessageId() {
        return messageId;
    }

    public void setMessageId(long messageId) {
        this.messageId = messageId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public Message setValue(String value) {
        this.value = value;
        return this;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Message [messageId=" + messageId + ", name=" + name + ", value=" + value + ", type=" + type + "]";
    }

    public Message() {
    }

    public Message(String type, String name, String value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    public Message(long id, String type, String name, String value) {
        this.messageId = id;
        this.type = type;
        this.name = name;
        this.value = value;
    }

}
