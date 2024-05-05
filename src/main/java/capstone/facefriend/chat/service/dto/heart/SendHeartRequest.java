package capstone.facefriend.chat.service.dto.heart;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class SendHeartRequest {
    private Long receiveId;
}