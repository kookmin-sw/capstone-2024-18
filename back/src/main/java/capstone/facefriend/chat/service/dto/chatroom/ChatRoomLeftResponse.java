package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.member.domain.member.Member;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record ChatRoomLeftResponse (
        String method,
        Long roomId,
        Long senderId,
        String senderNickname,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul") LocalDateTime sendTime,
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
