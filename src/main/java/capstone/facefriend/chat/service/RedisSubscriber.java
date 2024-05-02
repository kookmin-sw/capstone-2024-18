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
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisConnectionUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

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

                String destination = "/sub/chat/" + sendHeartResponse.getReceiveId().toString();

                if (isSubscribedChannel("/sub/chat/" + sendHeartResponse.getReceiveId())) {
                    messagingTemplate.convertAndSend("/sub/chat/" + sendHeartResponse.getReceiveId(), chatSendHeartResponse);
                } else {

                    // 아니라면, sendheartresponse를 redis에 저장하기
                    redisTemplate.opsForList().rightPush("/sub/chat/" + sendHeartResponse.getReceiveId(), sendHeartResponse);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to process message", e);
        }
    }
    private boolean isSubscribedChannel(String destination) {
        RedisConnection redisConnection = RedisConnectionUtils.getConnection(redisTemplate.getConnectionFactory());

        // 현재 구독 중인 채널의 목록을 가져옵니다.
        Map<String, Long> subscriptions = (Map<String, Long>) redisConnection.getSubscription();
        log.info("subscribe channel: {}",subscriptions);

        if (subscriptions == null) {
            return false;
        }

        // 특정 채널이 목록에 있는지 확인합니다.
        return subscriptions.containsKey(destination);
    }
}

