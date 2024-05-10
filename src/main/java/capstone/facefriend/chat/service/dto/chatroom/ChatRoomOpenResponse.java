package capstone.facefriend.chat.service.dto.chatroom;

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
    public static ChatRoomOpenResponse of(Member member, Member sender, ChatRoom chatRoom, String message) {
        return new ChatRoomOpenResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                member.getFaceInfo().getGeneratedS3url(),
                member.getFaceInfo().getOriginS3url(),
                sender.getId(),
                sender.getBasicInfo().getNickname(),
                sender.getFaceInfo().getGeneratedS3url(),
                sender.getFaceInfo().getOriginS3url(),
                chatRoom,
                message
        );
    }
}