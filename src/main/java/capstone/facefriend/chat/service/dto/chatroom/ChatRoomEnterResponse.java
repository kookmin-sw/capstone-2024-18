package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoomInfo;

import java.time.LocalDateTime;

public record ChatRoomEnterResponse(
        Long roomId,
        Long memberId,
        LocalDateTime enterTime
) {
    public static ChatRoomEnterResponse of(Long roomId, Long memberId, ChatRoomInfo chatRoomInfo) {
        return new ChatRoomEnterResponse(
                roomId,
                memberId,
                chatRoomInfo.getEnterTime()
        );
    }
}
