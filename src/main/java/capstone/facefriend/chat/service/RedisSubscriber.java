package capstone.facefriend.chat.service;

import capstone.facefriend.chat.infrastructure.repository.dto.GetMessageResponse;
import capstone.facefriend.chat.infrastructure.repository.dto.GetSendHeartResponse;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageResponse;
import capstone.facefriend.chat.infrastructure.repository.dto.SendHeartResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;

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

            // redis에서 발행된 데이터를 받아 역직렬화
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());

            log.info("Received message from Redis: {}", publishMessage); // 메시지 내용 로깅

            if (publishMessage.contains("message")) {
                MessageResponse messageResponse = objectMapper.readValue(publishMessage, MessageResponse.class);

                GetMessageResponse chatMessageResponse = new GetMessageResponse(messageResponse);

                messagingTemplate.convertAndSend("/sub/chat/" + messageResponse.getReceiveId(), chatMessageResponse);

            } else if (publishMessage.contains("Heart")) {
                SendHeartResponse sendHeartResponse = objectMapper.readValue(publishMessage, SendHeartResponse.class);

                GetSendHeartResponse chatSendHeartResponse = new GetSendHeartResponse(sendHeartResponse);

                    messagingTemplate.convertAndSend("/sub/chat/" + sendHeartResponse.getReceiveId(), chatSendHeartResponse);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to process message", e);
        }
    }
}