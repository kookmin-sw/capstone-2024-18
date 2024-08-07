package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.member.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByChatRoomId(Long roomId);
    @Query("SELECT c FROM ChatRoomMember c WHERE c.sender.id = :senderId AND c.receiver.id = :receiverId")
    Optional<ChatRoomMember> findBySenderAndReceiver(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
    ChatRoomMember save(ChatRoomMember chatRoomMember);
    Optional<List<ChatRoomMember>> findAllBySenderId(Long senderId);
    Optional<List<ChatRoomMember>> findAllByReceiverId(Long senderId);
    Optional<ChatRoomMember> findChatRoomMemberByChatRoom(ChatRoom chatRoom);
    Optional<ChatRoomMember> findChatRoomMemberBySenderAndReceiver(Member sender, Member receiver);
}