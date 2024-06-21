package capstone.facefriend.chat.service;

import capstone.facefriend.chat.dto.heart.GetSendHeartResponse;
import capstone.facefriend.chat.dto.heart.SendHeartResponse;
import capstone.facefriend.chat.dto.message.GetMessageResponse;
import capstone.facefriend.chat.dto.message.MessageResponse;
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
    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // redis에서 발행된 데이터를 받아 역직렬화
            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
            if (publishMessage.contains("message")) {
                log.info(publishMessage);
                MessageResponse messageResponse = objectMapper.readValue(publishMessage, MessageResponse.class);
                log.info(messageResponse.toString());
                GetMessageResponse chatMessageResponse = new GetMessageResponse(messageResponse);
                log.info(chatMessageResponse.toString());

                if (isExistSubscriber(messageResponse.getReceiveId())) {
                    messagingTemplate.convertAndSend("/sub/chat/" + messageResponse.getReceiveId(), chatMessageResponse);
                } else {
                    saveUnReadMessage("/sub/chat" + messageResponse.getReceiveId() + "message", messageResponse);
                }

                messagingTemplate.convertAndSend("/sub/chat/" + messageResponse.getSenderId(), chatMessageResponse);

            } else if (publishMessage.contains("Heart")) {
                SendHeartResponse sendHeartResponse = objectMapper.readValue(publishMessage, SendHeartResponse.class);

                GetSendHeartResponse chatSendHeartResponse = new GetSendHeartResponse(sendHeartResponse);
                if (isExistSubscriber(chatSendHeartResponse.getMemberId())) {
                    messagingTemplate.convertAndSend("/sub/chat/" + sendHeartResponse.getMemberId(), chatSendHeartResponse);
                } else {
                    saveUnReadHeart("/sub/chat" + sendHeartResponse.getMemberId() + "heart", sendHeartResponse);
                }

                messagingTemplate.convertAndSend("/sub/chat/" + sendHeartResponse.getSenderId(), chatSendHeartResponse);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to process message", e);
        }
    }

    private Boolean isExistSubscriber(Long memberId) {
        log.info("isExistSubscriber 호출");
        Boolean isMember = redisTemplate.opsForSet().isMember("SocketInfo", memberId);
        log.info("Socket: " + memberId);
        log.info("SocketInfo: " + isMember);

        return isMember;
    }



    private void saveUnReadMessage(String destination, MessageResponse messageResponse) {
        messageResponse.setMethod("connectChat");
        redisTemplate.opsForList().rightPush(destination, messageResponse);

    }

    private void saveUnReadHeart(String destination, SendHeartResponse sendHeartResponse) {
            sendHeartResponse.setMethod("connectHeart");
            redisTemplate.opsForList().rightPush(destination, sendHeartResponse);
    }
}