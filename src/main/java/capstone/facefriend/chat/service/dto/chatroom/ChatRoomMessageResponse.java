package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.member.domain.member.Member;

public record ChatRoomMessageResponse(
        Long memberId,
        String memberNickname,
        String memberGeneratedFaceS3url,
        String memberOriginFaceS3url,
        Long senderId,
        String senderNickname,
        String senderGeneratedFaceS3url,
        String senderOriginFaceS3url,
        ChatRoom chatRoom,
        ChatMessage chatMessage

){
    public static ChatRoomMessageResponse of(Member member, Member sender, ChatRoom chatRoom, ChatMessage message) {
        return new ChatRoomMessageResponse(
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