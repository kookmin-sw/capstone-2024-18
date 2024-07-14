package capstone.facefriend.message.service.dto.chatroom;

public record RoomEmptyResponse(
        Boolean isEmpty,
        String message
) {

    public static RoomEmptyResponse of(String message) {
        return new RoomEmptyResponse(true, message);
    }
}