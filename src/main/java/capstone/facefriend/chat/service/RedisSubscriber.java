package capstone.facefriend.chat.service;

import capstone.facefriend.chat.infrastructure.repository.dto.PublishMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    @Resource(name = "chatRedisTemplate")
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {

            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            PublishMessage chatMessage = objectMapper.readValue(publishMessage, PublishMessage.class);

            messagingTemplate.convertAndSend("/sub/chats/" + chatMessage.getRoomId(), chatMessage);

        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
