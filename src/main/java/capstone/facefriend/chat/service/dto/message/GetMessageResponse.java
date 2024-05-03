package capstone.facefriend.chat.service.dto.message;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
public class GetMessageResponse {
    private Long roomId;
    private Long senderId;
    private Long receiveId;
    private String senderNickname;
    private String type;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private Boolean isRead;

    public GetMessageResponse(MessageResponse messageResponse) {
        this.roomId = messageResponse.getRoomId();
        this.senderId = messageResponse.getSenderId();
        this.receiveId = messageResponse.getReceiveId();
        this.senderNickname = messageResponse.getSenderNickname();
        this.type = messageResponse.getType();
        this.content = messageResponse.getContent();
        this.createdAt = LocalDateTime.now();
        this.isRead = messageResponse.getIsRead();
    }
}