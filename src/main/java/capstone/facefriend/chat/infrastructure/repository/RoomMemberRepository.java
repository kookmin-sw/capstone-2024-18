package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.domain.RoomMember;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface RoomMemberRepository extends Repository<RoomMember, Long> {
    Optional<RoomMember> findByRoom(Room room);
    RoomMember save(RoomMember roomMember);
}
