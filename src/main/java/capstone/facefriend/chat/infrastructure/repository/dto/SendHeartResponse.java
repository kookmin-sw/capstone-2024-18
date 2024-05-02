package capstone.facefriend.chat.infrastructure.repository.dto;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendHeartResponse implements Serializable {
    private Long roomId;
    private Long senderId;
    private Long receiveId;
    private String senderName;
    private String type;
    private String sessionId;
}