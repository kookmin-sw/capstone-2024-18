package capstone.facefriend.chat.infrastructure.repository.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record MessageDto(
        Long ROOM_ID,
        Long SENDER_ID,
        @NotBlank String content,
        LocalDateTime createdAt,
        Boolean isRead
) {
}
