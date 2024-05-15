package capstone.facefriend.chat.service.dto.heart;

import capstone.facefriend.chat.domain.ChatRoom;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;

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

    public SendHeartResponse(LinkedHashMap<String, Object> map, ChatRoom chatRoom) {
        this.method = (String) map.get("method");
        this.memberId = ((Number) map.get("memberId")).longValue();
        this.senderName = (String) map.get("senderName");
        this.senderId = ((Number) map.get("senderId")).longValue(); // Fix this line
        this.type = (String) map.get("type");
        this.senderGeneratedS3url = (String) map.get("senderGeneratedS3url");
        this.senderOriginS3url = (String) map.get("senderOriginS3url");
        this.sessionId = (String) map.get("sessionId");
        this.createdAt = LocalDateTime.parse((String) map.get("createdAt"));
        this.isSender = (boolean) map.get("sender");
    }

}