package capstone.facefriend.chat.service.dto.chatroom;

import capstone.facefriend.chat.domain.ChatRoomInfo;

import java.time.LocalDateTime;

public record ChatRoomExitResponse(
        Long roomId,
        Long memberId,
        LocalDateTime enterTime
) {
    public static ChatRoomExitResponse of(Long roomId, Long memberId, LocalDateTime exitTime) {
        return new ChatRoomExitResponse(
                roomId,
                memberId,
                exitTime
        );
    }
}
