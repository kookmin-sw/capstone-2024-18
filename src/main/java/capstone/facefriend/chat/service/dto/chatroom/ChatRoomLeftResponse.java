package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.member.domain.member.Member;

import java.time.LocalDateTime;

public record ChatRoomLeftResponse (
        String method,
        Long roomId,
        Long senderId,
        String senderNickname,
        LocalDateTime sendTime,
        String content
){
    public static ChatRoomLeftResponse of (String method, Long roomId, Member sender, LocalDateTime sendTime, String content) {
    return new ChatRoomLeftResponse(
            method,
            roomId,
            sender.getId(),
            sender.getBasicInfo().getNickname(),
            sendTime,
            content
    );
    }
}
