package capstone.facefriend.chat.domain.dto;

import capstone.facefriend.chat.domain.ChatRoom;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class ResponseChatRooms {

    List<ChatRoomDto> chatRoomDtoList;

    @Builder
    public ResponseChatRooms(List<ChatRoom> chatRoomList) {
        List<ChatRoomDto> chatRoomDtoList = chatRoomList.stream()
                .map(chatRoom -> ChatRoomDto.builder()
                                    .chatRoomId(chatRoom.getId())
                                    .masterId(chatRoom.getMasterId())
                                    .inviterId(chatRoom.getInviterId())
                                    .build())
                .collect(Collectors.toList());

        this.chatRoomDtoList = chatRoomDtoList;
    }
}
