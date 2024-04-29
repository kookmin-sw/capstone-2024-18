package capstone.facefriend.chat.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRoomDto {
    private Long chatRoomId;
    private Long masterId;
    private Long inviterId;

    @Builder
    public ChatRoomDto(Long chatRoomId, Long masterId, Long inviterId) {
        this.chatRoomId = chatRoomId;
        this.masterId = masterId;
        this.inviterId = inviterId;
    }
}