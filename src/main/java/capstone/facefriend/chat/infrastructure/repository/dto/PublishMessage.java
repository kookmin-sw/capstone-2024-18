package capstone.facefriend.chat.infrastructure.repository.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PublishMessage {
    private Long roomId;
    private Long senderId;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
