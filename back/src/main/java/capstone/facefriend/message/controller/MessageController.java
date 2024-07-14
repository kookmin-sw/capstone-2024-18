package capstone.facefriend.message.controller;

import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.message.service.BackgroundService;
import capstone.facefriend.message.service.HeartService;
import capstone.facefriend.message.service.MessageService;
import capstone.facefriend.message.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.message.service.dto.heart.HeartRequest;
import capstone.facefriend.message.service.dto.message.MessageListRequest;
import capstone.facefriend.message.service.dto.message.MessageListResponse;
import capstone.facefriend.message.service.dto.message.MessageRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final HeartService heartService;
    private final BackgroundService backgroundService;
    private final JwtProvider jwtProvider;

    private static final String BEARER_PREFIX = "Bearer ";

    @MessageMapping("/stomp/connect")
    public void enterApp(
            StompHeaderAccessor headerAccessor
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long memberId = jwtProvider.extractId(token);
        backgroundService.enterApplication(memberId);
    }

    @PostMapping("/stomp/disconnect")
    public String exitApp(@AuthMember Long memberId) {
        return backgroundService.exitApplication(memberId);
    }

    @PostMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<MessageListResponse>> getMessagesPage(
            @PathVariable("roomId") Long roomId,
            @RequestParam(required = false, defaultValue = "1", value = "page") int pageNo,
            @RequestBody MessageListRequest messageListRequest
    ) {
        return ResponseEntity.ok(messageService.getMessagePage(roomId, pageNo, messageListRequest));
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
    public void sendHeart(
            StompHeaderAccessor headerAccessor,
            @RequestBody HeartRequest heartRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long senderId = jwtProvider.extractId(token);
        heartService.sendHeart(senderId, heartRequest.receiveId());
    }

    @MessageMapping("/chat/reply-heart")
    public void replyHeart(
            StompHeaderAccessor headerAccessor,
            HeartReplyRequest heartReplyRequest
    ) {
        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        Long receiveId = jwtProvider.extractId(token);
        heartService.heartReply(heartReplyRequest, receiveId);
    }
}