package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage findFirstByChatRoomIdOrderBySendTimeDesc(Long roomId);
    ChatMessage save(ChatMessage chatMessage);

}
