package capstone.facefriend.message.repository;

import capstone.facefriend.message.domain.Room;
import capstone.facefriend.message.domain.RoomMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface RoomMemberRepository extends CrudRepository<RoomMember, Long> {

    Optional<RoomMember> findByChatRoomId(Long roomId);

    @Query("SELECT c FROM RoomMember c WHERE c.sender.id = :senderId AND c.receiver.id = :receiverId")
    Optional<RoomMember> findBySenderAndReceiver(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    RoomMember save(RoomMember roomMember);

    Optional<List<RoomMember>> findAllBySenderId(Long senderId);

    Optional<List<RoomMember>> findAllByReceiverId(Long senderId);

    Optional<RoomMember> findChatRoomMemberByChatRoom(Room room);
}