package capstone.facefriend.message.service.dto.chatroom;

import capstone.facefriend.message.domain.Room;
import capstone.facefriend.member.domain.member.Member;

public record RoomCloseResponse(
        Long memberId,
        String memberNickname,
        String memberGeneratedS3url,
        String memberOriginS3url,
        Room room,
        String message
) {

    public static RoomCloseResponse of(Member member, Room room, String message) {
        return new RoomCloseResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                member.getFaceInfo().getGeneratedS3url(),
                member.getFaceInfo().getOriginS3url(),
                room,
                message
        );
    }
}