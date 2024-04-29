package capstone.facefriend.chat.domain.dto;

import capstone.facefriend.chat.domain.Chat;
import capstone.facefriend.chat.domain.ChatRoom;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatDto {

    private Long chatRoomId;
    private String message;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime sendTime;

    public Chat toEntity(ChatRoom chatRoom, Long senderId) {
        return Chat.builder()
                .chatRoom(chatRoom)
                .senderId(senderId)
                .message(message)
                .build();
    }
}
