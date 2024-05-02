package capstone.facefriend.chat.service.dto.heart;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

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
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

}