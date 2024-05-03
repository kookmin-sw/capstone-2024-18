package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByChatRoom(ChatRoom chatRoom);

    @Query("SELECT c FROM ChatRoomMember c WHERE c.sender.id = :senderId AND c.receiver.id = :receiverId")
    Optional<ChatRoomMember> findBySenderAndReceiver(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    //    Optional<ChatRoomMember> findChatRoomMemberBySenderAAndReceiver(Member sender, Member receiver);
    ChatRoomMember save(ChatRoomMember chatRoomMember);

    Optional<List<ChatRoomMember>> findAllBySenderId(Long senderId);
    Optional<List<ChatRoomMember>> findAllByReceiverId(Long senderId);
}