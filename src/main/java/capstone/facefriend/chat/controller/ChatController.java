package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.domain.dto.ChatDto;
import capstone.facefriend.chat.domain.dto.ResponseChat;
import capstone.facefriend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final RabbitTemplate template;
    private final ChatService chatService;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @MessageMapping("chat.enter.{chatRoomId}")
    public void enter(@Payload ChatDto chatDto, @DestinationVariable String chatRoomId) {
        chatDto.setMessage("입장하셨습니다.");
        chatDto.setSendTime(LocalDateTime.now());

        template.convertAndSend(
                exchangeName,
                routingKey + chatRoomId,
                chatDto
        );
    }

    @MessageMapping("chat.message.{chatRoomId}") // Destination Queue
    public void send(@Payload ChatDto chatDto, @AuthMember Long memberId, @DestinationVariable String chatRoomId) {
        chatDto.setSendTime(LocalDateTime.now());
        chatService.saveMessage(chatDto, memberId);

        template.convertAndSend(
                exchangeName,
                routingKey + chatRoomId,
                chatDto
        );
    }

    @GetMapping("/chat")
    public ResponseEntity<Page<ResponseChat>> getChats(Long chatRoomId, Pageable pageable) {
        Page<ResponseChat> chatPage = chatService.getChats(chatRoomId, pageable);
        return ResponseEntity.ok(chatPage);
    }

    // 큐에 들어온 메세지 소비 (디버그 용도)
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void receive(ChatDto chatDto) {
        log.info("received = {}", chatDto.getMessage());
    }
}
