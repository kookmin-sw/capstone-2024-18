package capstone.facefriend.chat.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.member.domain.member.Member;

public record ChatRoomOpenResponse (
        Long memberId,
        String memberNickname,
        String memberGeneratedS3url,
        String memberOriginS3url,
        Long senderId,
        String senderNickname,
        String senderGeneratedS3url,
        String senderOriginS3url,
        ChatRoom chatRoom,
        String message
) {
    public static ChatRoomOpenResponse of(Member member, Member sender, ChatRoom chatRoom, String senderFaceInfo, String memberFaceInfo, String openMessage) {
        return new ChatRoomOpenResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                memberFaceInfo,
                member.getFaceInfo().getOriginS3url(),
                sender.getId(),
                sender.getBasicInfo().getNickname(),
                senderFaceInfo,
                sender.getFaceInfo().getOriginS3url(),
                chatRoom,
                openMessage
        );
    }
}