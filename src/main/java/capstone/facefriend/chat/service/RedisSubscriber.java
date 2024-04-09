package capstone.facefriend.chat.service;

import capstone.facefriend.chat.infrastructure.repository.dto.MessageDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

        try {
            MessageDto messageDto = objectMapper.readValue(publishMessage, MessageDto.class);

            messagingTemplate.convertAndSend("/sub/chat/room/" + messageDto.getRoomId(), messageDto);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}

