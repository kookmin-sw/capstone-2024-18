package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.service.MessageService;
import capstone.facefriend.chat.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.chat.service.dto.heart.SendHeartRequest;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private static final String BEARER_PREFIX = "Bearer ";
    private final MessageService messageService;
    private final JwtProvider jwtProvider;

    @MessageMapping("/stomp/connect")
    public void enterApp(
            StompHeaderAccessor headerAccessor
    ){
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long memberId = jwtProvider.extractId(token);
        messageService.enterApplication(memberId);
    }

    @PostMapping("/stomp/disconnect")
    public void exitApp(
            @AuthMember Long memberId
    ){
        messageService.exitApplication(memberId);
    }

    @PostMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesPage(
            @PathVariable("roomId") Long roomId,
//            @AuthMember Long memberId,
            @RequestParam(required = false, defaultValue = "0", value = "page") int pageNo
    ){
        return ResponseEntity.ok(messageService.getMessagePage(roomId, pageNo));
    }


    @MessageMapping("/chat/messages")
    public void message(
            StompHeaderAccessor headerAccessor,
            MessageRequest messageRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long senderId = jwtProvider.extractId(token);
        messageService.sendMessage(messageRequest, senderId);
    }

    @MessageMapping("/chat/send-heart")
    public void sendheart(
            StompHeaderAccessor headerAccessor,
            @RequestBody SendHeartRequest sendHeartRequest
    ){
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long senderId = jwtProvider.extractId(token);
        messageService.sendHeart(senderId, sendHeartRequest.getReceiveId());
    }

    @MessageMapping("/chat/heart-reply")
    public void heartreply(
            StompHeaderAccessor headerAccessor,
            HeartReplyRequest heartReplyRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long receiveId = jwtProvider.extractId(token);

        messageService.heartReply(heartReplyRequest, receiveId);
    }

}