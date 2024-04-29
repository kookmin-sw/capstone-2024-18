package capstone.facefriend.chat.domain.dto;

import capstone.facefriend.chat.domain.ChatRoom;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RequestChatRoom {

    @NotBlank
    private Long inviterId;

    @Builder
    public RequestChatRoom(Long inviterId) {
        this.inviterId = inviterId;
    }

    public ChatRoom toEntity(Long memberId) {
        return ChatRoom.builder()
                .masterId(memberId)
                .inviterId(inviterId)
                .build();
    }
}