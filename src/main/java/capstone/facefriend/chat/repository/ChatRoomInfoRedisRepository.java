package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoomInfo;
import capstone.facefriend.chat.domain.ChatRoomInfoId;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ChatRoomInfoRedisRepository extends CrudRepository<ChatRoomInfo, Long> {
    Optional<ChatRoomInfo> findById(ChatRoomInfoId id);
}
