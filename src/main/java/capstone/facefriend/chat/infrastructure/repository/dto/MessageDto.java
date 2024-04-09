package capstone.facefriend.chat.infrastructure.repository.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageDto {

    private Long roomId;

    private Long senderId;

    @NotBlank
    private String content;

    private LocalDateTime createdAt;

    private Boolean isRead;

}