package capstone.facefriend.message.service.dto.message;

import lombok.Data;

@Data
public class MessageRequest {

    private Long roomId;

    private Long receiveId;

    private String content;
}