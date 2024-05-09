package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoomInfo;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ChatRoomInfoRedisRepository extends CrudRepository<ChatRoomInfo, String> {
    Optional<ChatRoomInfo> findById(String chatRoomInfoId);
}
