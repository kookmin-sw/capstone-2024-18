package capstone.facefriend.message.service.dto.heart;

import capstone.facefriend.message.domain.Room;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetSendHeartResponse {

    private String method;
    private String senderName;
    private Long senderId;
    private Long memberId;
    private String type;
    private String senderGeneratedS3url;
    private String senderOriginS3url;
    private Room room;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sendTime;
    private Boolean isSender;

    public GetSendHeartResponse(HeartResponse heartResponse) {
        this.method = heartResponse.getMethod();
        this.senderName = heartResponse.getSenderName();
        this.senderId = heartResponse.getSenderId();
        this.memberId = heartResponse.getMemberId();
        this.type = heartResponse.getType();
        this.sendTime = heartResponse.getCreatedAt();
        this.isSender = heartResponse.isSender();
        this.room = heartResponse.getRoom();
        this.senderGeneratedS3url = heartResponse.getSenderGeneratedS3url();
        this.senderOriginS3url = heartResponse.getSenderOriginS3url();
    }
}