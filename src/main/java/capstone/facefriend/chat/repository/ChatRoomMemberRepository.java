package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<List<ChatRoomMember>> findAllBySenderId(Long senderId);
    Optional<List<ChatRoomMember>> findAllByReceiverId(Long senderId);
}