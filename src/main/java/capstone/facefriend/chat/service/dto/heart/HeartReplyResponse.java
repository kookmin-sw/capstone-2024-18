package capstone.facefriend.chat.service.dto.heart;

public record HeartReplyResponse(
        Long senderId,
        String intention
) {
    public static HeartReplyResponse of (Long senderId, HeartReplyRequest heartReplyRequest) {
        return new HeartReplyResponse(
                senderId,
                heartReplyRequest.intention()
        );
    }
}