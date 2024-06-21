package capstone.facefriend.chat.dto.chatroom;

public record ChatRoomEmptyResponse(
        Boolean isEmpty,
        String message
){
    public static ChatRoomEmptyResponse of(String message) {
        return new ChatRoomEmptyResponse(
                true,
                message
        );
    }
}