package capstone.facefriend.chat.dto.chatroom;

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
        String content

){
    public static ChatRoomMessageResponse of(Member member, Member sender, ChatRoom chatRoom, String senderFaceInfo, String memberFaceInfo, ChatMessage message) {
        return new ChatRoomMessageResponse(
                member.getId(),
                member.getBasicInfo().getNickname(),
                memberFaceInfo,
                member.getFaceInfo().getOriginS3url(),
                sender.getId(),
                sender.getBasicInfo().getNickname(),
                senderFaceInfo,
                sender.getFaceInfo().getOriginS3url(),
                chatRoom,
                message.getContent()
        );
    }
}