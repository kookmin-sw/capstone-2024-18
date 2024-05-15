package capstone.facefriend.chat.service.dto.heart;

import capstone.facefriend.chat.domain.ChatRoom;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendHeartResponse implements Serializable {
    private String method;
    private Long memberId;
    private String senderName;
    private Long senderId;
    private String type;
    private String senderGeneratedS3url;
    private String senderOriginS3url;
    private ChatRoom chatRoom;
    private String sessionId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private boolean isSender;
}