package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthenticationContext;
import capstone.facefriend.auth.domain.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Order;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;


@Slf4j
@RequiredArgsConstructor
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class ChatAuthInterceptor implements ChannelInterceptor {

    private final TokenProvider tokenProvider;
    private final AuthenticationContext authenticationContext;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        assert headerAccessor != null;
        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            String accessToken = String.valueOf(headerAccessor.getNativeHeader("Authorization").get(0));

            Long memberId = tokenProvider.extractId(accessToken);
            authenticationContext.setAuthentication(memberId);
        }
        return message;
    }
}
