package capstone.facefriend.chat.service.dto.message;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class MessageRequest {
    private Long roomId;

    private Long receiveId;

    private String content;
}