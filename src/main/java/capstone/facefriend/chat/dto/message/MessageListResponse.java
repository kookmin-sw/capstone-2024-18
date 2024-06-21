package capstone.facefriend.chat.dto.message;

import capstone.facefriend.chat.domain.ChatMessage;

import java.time.LocalDateTime;

public record MessageListResponse(
        Long senderId,
        String senderNickname,
        String senderOriginS3Url,
        String senderGeneratedS3Url,
        String content,
        LocalDateTime sendTime
) {
    public static MessageListResponse of (ChatMessage message) {
        return new MessageListResponse(
                message.getSender().getId(),
                message.getSender().getBasicInfo().getNickname(),
                message.getSender().getFaceInfo().getOriginS3url(),
                message.getSender().getFaceInfo().getGeneratedS3url(),
                message.getContent(),
                message.getSendTime()
        );
    }
}