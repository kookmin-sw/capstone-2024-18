package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface ChatRoomMemberRepository extends Repository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByChatRoom(ChatRoom chatRoom);
    ChatRoomMember save(ChatRoomMember chatRoomMember);
}
