package capstone.facefriend.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;

@Component
@RequiredArgsConstructor
@Slf4j
public class FilterChannelInterceptor implements ChannelInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        log.info("Stomp Handler 실행");
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        StompCommand command = headerAccessor.getCommand();
        String destination = headerAccessor.getDestination();
        String subscribeUrl = headerAccessor.getSubscriptionId();
        String sessionId = headerAccessor.getSessionId();
        Object payload = message.getPayload();
        String messageHeaders = String.valueOf(accessor.getMessageHeaders());
        String messageType = String.valueOf(accessor.getMessageType());

        log.info("Command: {}", command);
        log.info("Destination: {}", destination);
        log.info("Subscription ID: {}", subscribeUrl);
        log.info("Session ID: {}", sessionId);
        log.info("Payload: {}", payload.toString());
        log.info("Message Type: {}", messageType);
        log.info("Message Headers: {}", messageHeaders.toString());


        String authorizationHeader = headerAccessor.getFirstNativeHeader("Authorization");
        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            String token = authorizationHeader.substring(BEARER_PREFIX.length());
            log.info("token: {}", token);
            if (token == null) try {
                throw new AccessDeniedException("");
            } catch (AccessDeniedException e) {
                throw new RuntimeException(e);
            }
        }
        return message;
    }
}
