package capstone.facefriend.chat.infrastructure.repository.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendHeartRequest {
    private Long receiveId;
}