package capstone.facefriend.chat.dto.message;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record MessageListRequest(
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime sendTime
) {
}
