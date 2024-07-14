package capstone.facefriend.message.service;

import capstone.facefriend.message.service.dto.heart.HeartResponse;
import capstone.facefriend.message.service.dto.message.MessageResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String publishMessage = redisTemplate.getStringSerializer().deserialize(message.getBody());

        if (publishMessage.contains("message")) {
            convertAndSendMessage(publishMessage);
        }

        if (publishMessage.contains("Heart")) {
            convertAndSendHeart(publishMessage);
        }
    }

    private void convertAndSendHeart(String publishMessage) {
        try {
            HeartResponse heartResponse = objectMapper.readValue(publishMessage, HeartResponse.class);

            if (isExistSubscriber(heartResponse.getMemberId())) {
                messagingTemplate.convertAndSend("/sub/chat/" + heartResponse.getMemberId(), heartResponse);
            } else {
                saveUnReadHeart("/sub/chat" + heartResponse.getMemberId() + "heart", heartResponse);
            }

            messagingTemplate.convertAndSend("/sub/chat/" + heartResponse.getSenderId(), heartResponse);
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void convertAndSendMessage(String publishMessage) {
        try {
            MessageResponse messageResponse = objectMapper.readValue(publishMessage, MessageResponse.class);

            if (isExistSubscriber(messageResponse.getReceiveId())) {
                messagingTemplate.convertAndSend("/sub/chat/" + messageResponse.getReceiveId(), messageResponse);
            } else {
                saveUnReadMessage("/sub/chat" + messageResponse.getReceiveId() + "message", messageResponse);
            }
            messagingTemplate.convertAndSend("/sub/chat/" + messageResponse.getSenderId(), messageResponse);
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private Boolean isExistSubscriber(Long memberId) {
        return redisTemplate.opsForSet().isMember("SocketInfo", memberId);
    }

    private void saveUnReadMessage(String destination, MessageResponse messageResponse) {
        messageResponse.setMethod("connectChat");
        redisTemplate.opsForList().rightPush(destination, messageResponse);
    }

    private void saveUnReadHeart(String destination, HeartResponse heartResponse) {
        heartResponse.setMethod("connectHeart");
        redisTemplate.opsForList().rightPush(destination, heartResponse);
    }
}