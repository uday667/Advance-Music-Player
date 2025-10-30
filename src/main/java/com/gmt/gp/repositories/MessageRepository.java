package com.gmt.gp.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.gmt.gp.model.Message;

public interface MessageRepository extends CrudRepository<Message, Long> {

    Message getByMessageId(long messageId);

    List<Message> getByType(String type);

    Message getByName(String name);

    List<Message> findByName(String name);

    Message getByValue(String value);

}
