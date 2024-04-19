package capstone.facefriend.chat.infrastructure.repository.dto;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;

public record ChatRoomResponse(
    Long sender,
    Long receiver,
    ChatRoom chatRoom
){
    public static ChatRoomResponse of(ChatRoomMember chatRoomMember) {
        return new ChatRoomResponse(
                chatRoomMember.getSender().getId(),
                chatRoomMember.getReceiver().getId(),
                chatRoomMember.getChatRoom()
        );
    }
}
