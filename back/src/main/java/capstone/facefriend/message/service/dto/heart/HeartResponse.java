package capstone.facefriend.message.service.dto.heart;

import capstone.facefriend.message.domain.Room;
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
public class HeartResponse implements Serializable {

    private String method;
    private Long memberId;
    private String senderName;
    private Long senderId;
    private String type;
    private String senderGeneratedS3url;
    private String senderOriginS3url;
    private Room room;
    private String sessionId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private boolean isSender;

    public HeartResponse(LinkedHashMap<String, Object> map, Room room) {
        this.method = (String) map.get("method");
        this.memberId = ((Number) map.get("memberId")).longValue();
        this.senderName = (String) map.get("senderName");
        this.senderId = ((Number) map.get("senderId")).longValue();
        this.type = (String) map.get("type");
        this.senderGeneratedS3url = (String) map.get("senderGeneratedS3url");
        this.senderOriginS3url = (String) map.get("senderOriginS3url");
        this.sessionId = (String) map.get("sessionId");
        this.createdAt = LocalDateTime.parse((String) map.get("createdAt"));
        this.isSender = (boolean) map.get("sender");
    }

}