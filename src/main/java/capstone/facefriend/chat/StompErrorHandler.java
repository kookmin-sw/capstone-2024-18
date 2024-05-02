package capstone.facefriend.chat;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
public class StompErrorHandler extends TextWebSocketHandler {
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트와의 연결이 성공적으로 수립될 때 실행되는 코드
        super.afterConnectionEstablished(session);
        // 연결이 성공했을 때의 추가 작업 수행
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 클라이언트와의 연결이 종료될 때 실행되는 코드
        super.afterConnectionClosed(session, status);
        // 연결이 종료됐을 때의 추가 작업 수행
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트로부터 메시지를 수신했을 때 실행되는 코드
        super.handleTextMessage(session, message);
        // 메시지 처리 작업 수행
    }

}
