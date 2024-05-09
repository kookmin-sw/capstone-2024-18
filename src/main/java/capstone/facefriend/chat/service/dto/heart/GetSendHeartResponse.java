package capstone.facefriend.chat.service.dto.heart;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
public class GetSendHeartResponse {
    private String senderName;
    private Long senderId;
    private Long receiveId;
    private String type;
    private Long roomId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sendTime;


    public GetSendHeartResponse(SendHeartResponse sendHeartResponse) {
        this.senderName = sendHeartResponse.getSenderName();
        this.senderId = sendHeartResponse.getSenderId();
        this.receiveId = sendHeartResponse.getReceiveId();
        this.type = sendHeartResponse.getType();
        this.roomId = sendHeartResponse.getRoomId();
        this.sendTime = sendHeartResponse.getCreatedAt();
    }
}