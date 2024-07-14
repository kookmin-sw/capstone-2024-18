package capstone.facefriend.message.controller;

import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.message.service.ChatRoomService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomController {
    private final ChatRoomService chatRoomService;

    @GetMapping("/room/list")
    ResponseEntity<Map<String, Object>> getChatRoomList(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(chatRoomService.getChatRoomList(memberId));
    }

    @PostMapping("/room/{roomId}/left")
    public ResponseEntity<String> leftChatRoom(
            @PathVariable("roomId") Long roomId,
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(chatRoomService.leftRoom(roomId, memberId));
    }

}