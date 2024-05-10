package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.member.domain.member.Member;

public record ChatRoomCloseResponse(
        Long memberId,
        String memberNickname,
        String memberGeneratedS3url,
        String memberOriginS3url,
        ChatRoom chatRoom,
        String message
) {
    public static ChatRoomCloseResponse of(Member member, ChatRoom chatRoom, String message) {
        return new ChatRoomCloseResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                member.getFaceInfo().getGeneratedS3url(),
                member.getFaceInfo().getOriginS3url(),
                chatRoom,
                message
        );
    }
}