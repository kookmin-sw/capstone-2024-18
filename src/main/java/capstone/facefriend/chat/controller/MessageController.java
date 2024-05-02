package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.SendHeartRequest;
import capstone.facefriend.chat.service.ChatRoomService;
import capstone.facefriend.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private static final String BEARER_PREFIX = "Bearer ";
    private final MessageService messageService;
    private final ChatRoomService chatRoomService;
    private final MappingJackson2HttpMessageConverter converter;
    private final JwtProvider jwtProvider;


    @MessageMapping("/test")
    @SendTo("/sub/test")
    public String test(
            StompHeaderAccessor headerAccessor
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("token: {}",token);
        Long senderId = jwtProvider.extractId(token);
        log.info("senderId: {}",senderId.toString());

        return "테스트 자동화 했다고 왜 안돼? 자동으로 되는 거 이제?";
    }

    @SubscribeMapping("/chat/{receiveId}")
    public void handleSubscription(
            @DestinationVariable Long receiveId
    ) {
        log.info("subscribeMapping 작동");
        messageService.sendSentMessage(receiveId);
    }

    @MessageMapping("/chat/send-heart")
    public void sendheart(
            StompHeaderAccessor headerAccessor,
            SendHeartRequest sendHeartRequest
    ){
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("token: {}",token);
        Long senderId = jwtProvider.extractId(token);
        log.info("senderId: {}",senderId.toString());
        String destination = headerAccessor.getDestination();
        String sessionId = headerAccessor.getSessionId();
        messageService.sendHeart(senderId, sendHeartRequest.getReceiveId(), destination, sessionId);
    }

    @MessageMapping("/chat/messages")
    public void message(
            StompHeaderAccessor headerAccessor,
            MessageRequest messageRequest
            ) {
        Long senderId = Long.valueOf(headerAccessor.getFirstNativeHeader("Sender"));
        messageService.sendMessage(messageRequest, senderId);
    }

}