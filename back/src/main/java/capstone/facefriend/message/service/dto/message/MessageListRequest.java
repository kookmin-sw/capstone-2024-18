package capstone.facefriend.message.service.dto.message;

import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

public record MessageListRequest(
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime sendTime
) {

}
