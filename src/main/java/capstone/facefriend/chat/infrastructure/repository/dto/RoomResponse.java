package capstone.facefriend.chat.infrastructure.repository.dto;

import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.domain.RoomMember;

public record RoomResponse (
    Long sender,
    Long receiver,
    Room room
){
    public static RoomResponse of(RoomMember roomMember) {
        return new RoomResponse(
                roomMember.getSender().getId(),
                roomMember.getReceiver().getId(),
                roomMember.getRoom()
        );
    }
}
