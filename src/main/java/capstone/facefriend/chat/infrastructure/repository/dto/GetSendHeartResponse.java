package capstone.facefriend.chat.infrastructure.repository.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetSendHeartResponse {
    private String senderName;
    private Long senderId;
    private Long receiveId;
    private String type;
    private Long roomId;

    public GetSendHeartResponse(SendHeartResponse sendHeartResponse) {
        this.senderName = sendHeartResponse.getSenderName();
        this.senderId = sendHeartResponse.getSenderId();
        this.receiveId = sendHeartResponse.getReceiveId();
        this.type = sendHeartResponse.getType();
        this.roomId = sendHeartResponse.getRoomId();
    }
}
