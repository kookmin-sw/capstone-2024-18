package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;

import java.time.LocalDateTime;

public record ChatRoomMessageResponse(
        Long sender,
        Long receiver,
        ChatRoom chatRoom,
        String content,
        LocalDateTime sendTime,
        String senderNickname,
        String senderGeneratedFaceInfo,
        String senderOriginalFaceInfo

){
    public static ChatRoomMessageResponse of(ChatRoomMember chatRoomMember, ChatMessage message) {
        return new ChatRoomMessageResponse(
                chatRoomMember.getSender().getId(),
                chatRoomMember.getReceiver().getId(),
                chatRoomMember.getChatRoom(),
                message.getContent(),
                message.getSendTime(),
                message.getSender().getBasicInfo().getNickname(),
                message.getSender().getFaceInfo().getGeneratedS3url(),
                message.getSender().getFaceInfo().getOriginS3url()
        );
    }
}