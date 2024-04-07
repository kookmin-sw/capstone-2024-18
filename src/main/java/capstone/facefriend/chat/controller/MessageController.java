package capstone.facefriend.chat.controller;

import capstone.facefriend.chat.infrastructure.repository.dto.MessageDto;
import capstone.facefriend.chat.infrastructure.repository.dto.PublishMessage;
import capstone.facefriend.chat.service.MessageService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    private final ChannelTopic topic;

    @Resource(name = "chatRedisTemplate")
    private final RedisTemplate redisTemplate;

    @MessageMapping("/test")
    @SendTo("/sub/test")
    public String test() {
        return "테스트 자동화 했다고 왜 안돼? 자동으로 되는 거 이제?";
    }

    @MessageMapping("/chats/messages/{room-id}")
    public void message(@DestinationVariable("room-id") Long roomId, MessageDto messageDto) {

        PublishMessage publishMessage =
                new PublishMessage(
                        messageDto.ROOM_ID(),
                        messageDto.SENDER_ID(),
                        messageDto.content(),
                        messageDto.isRead(),
                        LocalDateTime.now()
                );

        // 채팅방에 메세지 전송
        redisTemplate.convertAndSend(topic.getTopic(), publishMessage);

        messageService.CachedMessage(messageDto, roomId);
    }
}