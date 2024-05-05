package capstone.facefriend.chat.service.dto.chatroom;

public record ChatRoomOpenResponse (
        Long senderId,
        String senderNickname,
        String message
) {
    public static ChatRoomOpenResponse of(Long senderId, String senderNickname, String message) {
        return new ChatRoomOpenResponse(
                senderId,
                senderNickname,
                message
        );
    }
}