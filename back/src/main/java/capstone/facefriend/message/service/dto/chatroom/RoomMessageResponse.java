package capstone.facefriend.message.service.dto.chatroom;

import capstone.facefriend.message.domain.Message;
import capstone.facefriend.message.domain.Room;
import capstone.facefriend.member.domain.member.Member;

public record RoomMessageResponse(
        Long memberId,
        String memberNickname,
        String memberGeneratedFaceS3url,
        String memberOriginFaceS3url,
        Long senderId,
        String senderNickname,
        String senderGeneratedFaceS3url,
        String senderOriginFaceS3url,
        Room room,
        String content

) {

    public static RoomMessageResponse of(
            Member member,
            Member sender,
            Room room,
            String memberFaceInfo,
            String senderFaceInfo,
            Message message
    ) {
        return new RoomMessageResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                memberFaceInfo,
                member.getFaceInfo().getOriginS3url(),
                sender.getId(),
                sender.getBasicInfo().getNickname(),
                senderFaceInfo,
                sender.getFaceInfo().getOriginS3url(),
                room,
                message.getContent()
        );
    }
}