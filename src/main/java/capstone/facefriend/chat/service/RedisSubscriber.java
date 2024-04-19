package capstone.facefriend.chat.service;

import capstone.facefriend.chat.infrastructure.repository.dto.MessageResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String publishMessage = new String(message.getBody(), StandardCharsets.UTF_8);

            log.info("Received message from Redis: {}", publishMessage); // 메시지 내용 로깅

            MessageResponse messageResponse = objectMapper.readValue(publishMessage, MessageResponse.class);
            messagingTemplate.convertAndSend("/sub/chat/room/" + messageResponse.getRoomId(), messageResponse);

        } catch (IOException e) {
            throw new RuntimeException("Failed to process message", e);
        }
    }


//    public void onHeart(Message message, byte[] pattern) {
//        String publishRequest = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
//
//        try {
//            ChatRoomResponse chatRoomResponse = objectMapper.readValue(publishRequest, ChatRoomResponse.class);
//
//            messagingTemplate.convertAndSend("sub/chat/room/" + chatRoomResponse.chatRoom().getId(), chatRoomResponse);
//        }  catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
//
//    }

}

