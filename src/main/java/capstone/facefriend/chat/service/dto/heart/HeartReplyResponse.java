package capstone.facefriend.chat.service.dto.heart;

public record HeartReplyResponse(
        String method,
        Long senderId,
        String intention

) {
    public static HeartReplyResponse of (Long senderId, HeartReplyRequest heartReplyRequest, String method) {
        return new HeartReplyResponse(
                method,
                senderId,
                heartReplyRequest.intention()
        );
    }
}