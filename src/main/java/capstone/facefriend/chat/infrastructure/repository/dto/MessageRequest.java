package capstone.facefriend.chat.infrastructure.repository.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private Long roomId;

    private Long receiveId;

    private String content;
}
