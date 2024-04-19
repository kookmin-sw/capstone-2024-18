package capstone.facefriend.chat.infrastructure.repository.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;


@Getter
@Setter
@Data
@NoArgsConstructor
public class MessageResponse implements Serializable {
    private Long roomId;
    private Long senderId;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
    private Boolean isRead;
}
