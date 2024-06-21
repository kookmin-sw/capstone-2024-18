package capstone.facefriend.chat.dto.heart;

public record HeartReplyRequest(
        Long senderId,
        String intention
) {}