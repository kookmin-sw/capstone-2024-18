package capstone.facefriend.message.service.dto.chatroom;

import capstone.facefriend.message.domain.Room;
import capstone.facefriend.member.domain.member.Member;

public record RoomHeartResponse(
        Long memberId,
        String memberNickname,
        String memberGeneratedS3url,
        String memberOriginS3url,
        Long senderId,
        String senderNickname,
        String senderGeneratedS3url,
        String senderOriginS3url,
        Room room,
        Boolean isSender
) {

    public static RoomHeartResponse of(
            Member member,
            Member sender,
            Room room,
            String memberFaceInfo,
            String senderFaceInfo,
            Boolean isSender
    ) {
        return new RoomHeartResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                memberFaceInfo,
                member.getFaceInfo().getOriginS3url(),
                sender.getId(),
                sender.getBasicInfo().getNickname(),
                senderFaceInfo,
                sender.getFaceInfo().getOriginS3url(),
                room,
                isSender
        );
    }
}