package capstone.facefriend.chat.service.dto.heart;

import capstone.facefriend.chat.domain.ChatRoom;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


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
    private ChatRoom chatRoom;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime sendTime;
    private Boolean isSender;

    public GetSendHeartResponse(SendHeartResponse sendHeartResponse) {
        this.method = sendHeartResponse.getMethod();
        this.senderName = sendHeartResponse.getSenderName();
        this.senderId = sendHeartResponse.getSenderId();
        this.memberId = sendHeartResponse.getMemberId();
        this.type = sendHeartResponse.getType();
        this.sendTime = sendHeartResponse.getCreatedAt();
        this.isSender = sendHeartResponse.isSender();
        this.chatRoom = sendHeartResponse.getChatRoom();
        this.senderGeneratedS3url = sendHeartResponse.getSenderGeneratedS3url();
        this.senderOriginS3url = sendHeartResponse.getSenderOriginS3url();
    }
}