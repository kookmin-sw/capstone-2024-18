package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomIdOrderByCreatedAt(Long roomId, Pageable pageable);

    ChatMessage save(ChatMessage chatMessage);

}
