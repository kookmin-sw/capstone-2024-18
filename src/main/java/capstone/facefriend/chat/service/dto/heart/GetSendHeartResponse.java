package capstone.facefriend.chat.service.dto.heart;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Data
@NoArgsConstructor
public class GetSendHeartResponse {
    private String senderName;
    private Long senderId;
    private Long receiveId;
    private String type;
    private Long roomId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;


    public GetSendHeartResponse(SendHeartResponse sendHeartResponse) {
        this.senderName = sendHeartResponse.getSenderName();
        this.senderId = sendHeartResponse.getSenderId();
        this.receiveId = sendHeartResponse.getReceiveId();
        this.type = sendHeartResponse.getType();
        this.roomId = sendHeartResponse.getRoomId();
        this.createdAt = sendHeartResponse.getCreatedAt();
    }
}