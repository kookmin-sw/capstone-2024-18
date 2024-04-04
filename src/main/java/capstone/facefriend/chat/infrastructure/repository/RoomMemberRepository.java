package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.RoomMember;
import org.springframework.data.repository.Repository;

public interface RoomMemberRepository extends Repository<RoomMember, Long> {
    RoomMember save(RoomMember roomMember);
}
