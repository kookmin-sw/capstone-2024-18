package capstone.facefriend.chat.service.dto.heart;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HeartReplyRequest {
    Long senderId;
    String intention;
}