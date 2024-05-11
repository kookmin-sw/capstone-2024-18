package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.member.domain.member.Member;

public record ChatRoomLeftResponse (
        Long senderId,
        String senderNickname,
        String content
){
    public static ChatRoomLeftResponse of (Member sender, String content) {
    return new ChatRoomLeftResponse(
            sender.getId(),
            sender.getBasicInfo().getNickname(),
            content
    );
    }
}
