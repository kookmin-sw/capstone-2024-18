package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.ChatRoom;
import org.springframework.data.repository.Repository;

import java.util.Optional;
public interface ChatRoomRepository extends Repository<ChatRoom, Long> {

    Optional<ChatRoom> findById(Long id);
    ChatRoom save(ChatRoom chatRoom);
}
