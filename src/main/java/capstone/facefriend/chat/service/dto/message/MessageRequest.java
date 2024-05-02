package capstone.facefriend.chat.service.dto.message;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private Long roomId;

    private Long receiveId;

    private String content;
}
