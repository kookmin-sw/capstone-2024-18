package capstone.facefriend.message.controller.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FilterChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        StompCommand command = headerAccessor.getCommand();
        String destination = headerAccessor.getDestination();
        String subscribeUrl = headerAccessor.getSubscriptionId();
        String sessionId = headerAccessor.getSessionId();
        Object payload = message.getPayload();
        String messageHeaders = String.valueOf(accessor.getMessageHeaders());
        String messageType = String.valueOf(accessor.getMessageType());

        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            log.info("Command: {}", command);
            log.info("Destination: {}", destination);
            log.info("Subscription ID: {}", subscribeUrl);
            log.info("Session ID: {}", sessionId);
            log.info("Payload: {}", payload);
            log.info("Message Type: {}", messageType);
            log.info("Message Headers: {}", messageHeaders);
        }

        if (headerAccessor.getCommand() == StompCommand.SUBSCRIBE) {
            log.info("Command: {}", command);
            log.info("Destination: {}", destination);
            log.info("Subscription ID: {}", subscribeUrl);
            log.info("Session ID: {}", sessionId);
            log.info("Payload: {}", payload);
            log.info("Message Type: {}", messageType);
            log.info("Message Headers: {}", messageHeaders);
        }

        if (headerAccessor.getCommand() == StompCommand.DISCONNECT) {
            log.info("Command: {}", command);
            log.info("Destination: {}", destination);
            log.info("Subscription ID: {}", subscribeUrl);
            log.info("Session ID: {}", sessionId);
            log.info("Payload: {}", payload);
            log.info("Message Type: {}", messageType);
            log.info("Message Headers: {}", messageHeaders.toString());
        }

        if (headerAccessor.getCommand() == StompCommand.SEND) {
            log.info("Command: {}", command);
            log.info("Destination: {}", destination);
            log.info("Subscription ID: {}", subscribeUrl);
            log.info("Session ID: {}", sessionId);
            log.info("Payload: {}", payload);
            log.info("Message Type: {}", messageType);
            log.info("Message Headers: {}", messageHeaders.toString());
        }

        return message;
    }
}