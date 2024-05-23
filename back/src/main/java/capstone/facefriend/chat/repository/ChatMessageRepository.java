package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage findFirstByChatRoomIdOrderBySendTimeDesc(Long roomId);
    ChatMessage save(ChatMessage chatMessage);
    List<ChatMessage> findChatMessagesByChatRoom_IdAndSendTimeBefore(Long roomId, LocalDateTime time, Pageable pageable);
    List<ChatMessage> findChatMessagesByChatRoomId(Long roomId);
    Integer countChatMessagesByChatRoom(ChatRoom chatRoom);
}