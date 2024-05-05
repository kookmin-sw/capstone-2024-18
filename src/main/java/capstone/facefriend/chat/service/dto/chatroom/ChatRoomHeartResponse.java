package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.service.dto.heart.GetSendHeartResponse;

public record ChatRoomHeartResponse (
        Long sender,
        Long receiver,
        ChatRoom chatRoom,
        GetSendHeartResponse sendHeart

) {
    public static ChatRoomHeartResponse of(ChatRoomMember chatRoomMember, GetSendHeartResponse sendHeartResponse) {
        return new ChatRoomHeartResponse(
                chatRoomMember.getSender().getId(),
                chatRoomMember.getReceiver().getId(),
                chatRoomMember.getChatRoom(),
                sendHeartResponse
        );
    }
}