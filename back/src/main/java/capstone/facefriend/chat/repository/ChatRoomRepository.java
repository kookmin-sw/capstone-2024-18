package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findById(Long id);
    ChatRoom save(ChatRoom chatRoom);
}