package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.chat.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import capstone.facefriend.chat.service.dto.heart.SendHeartRequest;
import capstone.facefriend.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private static final String BEARER_PREFIX = "Bearer ";
    private final MessageService messageService;
    private final MappingJackson2HttpMessageConverter converter;
    private final JwtProvider jwtProvider;

    @MessageMapping("/test")
    @SendTo("/sub/test")
    public String test() {
        return "테스트 메시지";
    }

    @MessageMapping("/chat/messages")
    public void message(
            StompHeaderAccessor headerAccessor,
            MessageRequest messageRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("token: {}",token);
        Long senderId = jwtProvider.extractId(token);
        log.info("senderId: {}",senderId.toString());
        String destination = headerAccessor.getDestination();
        messageService.sendMessage(messageRequest, senderId);
    }

    @MessageMapping("/chat/send-heart")
    public void sendheart(
            StompHeaderAccessor headerAccessor,
            @RequestBody SendHeartRequest sendHeartRequest
    ){
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("token: {}",token);
        Long senderId = jwtProvider.extractId(token);
        log.info("senderId: {}",senderId.toString());
        String destination = headerAccessor.getDestination();
        messageService.sendHeart(senderId, sendHeartRequest.getReceiveId());
    }

    @MessageMapping("/chat/heart-reply")
    public void heartreply(
            StompHeaderAccessor headerAccessor,
            HeartReplyRequest heartReplyRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("token: {}",token);
        Long receiveId = jwtProvider.extractId(token);
        log.info("receiveId: {}",receiveId.toString());

        messageService.heartReply(heartReplyRequest, receiveId);
    }

}