package capstone.facefriend.chat.service.dto.message;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class GetMessageResponse {

    private String method;
    private Long roomId;
    private Long senderId;
    private Long receiveId;
    private String senderNickname;
    private String senderFaceInfoS3Url;
    private String type;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm", timezone = "Asia/Seoul")
    private LocalDateTime sendTime;
    private Boolean isRead;

    public GetMessageResponse(MessageResponse messageResponse) {
        this.method = messageResponse.getMethod();
        this.roomId = messageResponse.getRoomId();
        this.senderId = messageResponse.getSenderId();
        this.receiveId = messageResponse.getReceiveId();
        this.senderNickname = messageResponse.getSenderNickname();
        this.senderFaceInfoS3Url = messageResponse.getSenderFaceInfoS3Url();
        this.type = messageResponse.getType();
        this.content = messageResponse.getContent();
        this.sendTime = messageResponse.getCreatedAt();
        this.isRead = messageResponse.getIsRead();
    }
}