package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage save(ChatMessage chatMessage);
    List<ChatMessage> findChatMessagesByChatRoom_IdAndSendTimeBefore(Long roomId, LocalDateTime time, Pageable pageable);
    List<ChatMessage> findChatMessagesByChatRoomId(Long roomId);
}