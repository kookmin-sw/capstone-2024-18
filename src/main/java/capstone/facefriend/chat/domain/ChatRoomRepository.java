package capstone.facefriend.chat.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    ChatRoom save(ChatRoom chatRoom);

    List<ChatRoom> findAllByMasterIdOrInviterId(Long masterId, Long inviterId);

    Optional<ChatRoom> findById(Long id);

    void deleteChatRoomByMasterIdAndId(Long masterId, Long id);
}
