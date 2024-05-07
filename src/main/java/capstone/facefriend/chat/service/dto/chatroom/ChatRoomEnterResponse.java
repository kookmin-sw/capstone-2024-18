package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoomInfo;

import java.time.LocalDateTime;

public record ChatRoomEnterResponse(
        Long roomId,
        Long memberId,
        LocalDateTime enterTime
) {
    public static ChatRoomEnterResponse of(ChatRoomInfo chatRoomInfo) {
        return new ChatRoomEnterResponse(
                chatRoomInfo.getId().getRoomId(),
                chatRoomInfo.getId().getMemberId(),
                chatRoomInfo.getEnterTime()
        );
    }
}
