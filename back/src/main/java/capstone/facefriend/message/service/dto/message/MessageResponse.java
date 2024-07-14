package capstone.facefriend.message.service.dto.message;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse implements Serializable {

    private String method;
    private Long roomId;
    private Long receiveId;
    private Long senderId;
    private String content;
    private String type;
    private String senderNickname;
    private String senderFaceInfoS3Url;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private Boolean isRead;

    public MessageResponse(LinkedHashMap<String, Object> map) {
        this.method = (String) map.get("method");
        this.roomId = ((Number) map.get("roomId")).longValue();
        this.receiveId = ((Number) map.get("receiveId")).longValue();
        this.senderId = ((Number) map.get("senderId")).longValue();
        this.content = (String) map.get("content");
        this.type = (String) map.get("type");
        this.senderNickname = (String) map.get("senderNickname");
        this.senderFaceInfoS3Url = (String) map.get("senderFaceInfoS3Url");
        this.createdAt = LocalDateTime.parse((String) map.get("createdAt"));
        this.isRead = (Boolean) map.get("isRead");
    }
}