package capstone.facefriend.chat.domain.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ResponseChat {

    private Long id;
    private Long chatRoomId; // 방 번호
    private Long senderId;
    private String message;
    private LocalDateTime sendTime;

    @QueryProjection
    public ResponseChat(Long id, Long chatRoomId, Long senderId, String message, LocalDateTime sendTime) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.message = message;
        this.sendTime = sendTime;
    }
}
