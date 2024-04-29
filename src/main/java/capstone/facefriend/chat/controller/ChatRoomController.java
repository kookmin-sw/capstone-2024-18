package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.dto.RequestChatRoom;
import capstone.facefriend.chat.domain.dto.ResponseChatRooms;
import capstone.facefriend.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@Slf4j
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping("/room")
    public ResponseEntity<Long> createChatRoom(
            @AuthMember Long memberId,
            @RequestBody RequestChatRoom requestChatRoom) {
        Long chatRoomId = chatRoomService.createChatRoom(memberId, requestChatRoom);
        return ResponseEntity.ok(chatRoomId);
    }

    @GetMapping("/room")
    public ResponseEntity<ResponseChatRooms> getChatRooms(@AuthMember Long memberId) {
        ResponseChatRooms responseChatRoom = chatRoomService.getChatRooms(memberId);
        return ResponseEntity.ok(responseChatRoom);
    }

    @GetMapping("/room/{chatroom_id}")
    public ResponseEntity<ChatRoom> getChatRoom(@PathVariable("chatroom_id") Long id) {
        ChatRoom chatRoom = chatRoomService.getChatRoom(id);
        return ResponseEntity.ok(chatRoom);
    }

    @DeleteMapping("/room/{chatroom_id}")
    public ResponseEntity<String> deleteChatRoom(@AuthMember Long masterId, @PathVariable("chatroom_id") Long id) {
        chatRoomService.deleteChatRoom(masterId, id);
        return ResponseEntity.ok("삭제 완료");
    }


}
