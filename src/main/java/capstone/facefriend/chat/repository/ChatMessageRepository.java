package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    ChatMessage findFirstByChatRoomIdOrderBySendTimeDesc(Long roomId);
    ChatMessage save(ChatMessage chatMessage);

    List<ChatMessage> findChatMessageByChatRoom(Long roomId, Pageable pageable);
}