package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.service.ChatRoomService;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomEnterResponse;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomExitResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    @GetMapping("/room/list")
    ResponseEntity<Map<String, Object>> getChatRoomList(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(chatRoomService.getChatRoomList(memberId));
    }

    @PostMapping("/room/{roomId}/enter")
    public ResponseEntity<ChatRoomEnterResponse> enterChatRoom(
            @PathVariable("roomId") Long roomId,
            @AuthMember Long memberId,
            @RequestParam(required = false, defaultValue = "0", value = "page") int pageNo
    ){
        return ResponseEntity.ok(chatRoomService.enterRoom(roomId, memberId));
    }

    @PostMapping("/room/{roomId}/exit")
    public ResponseEntity<ChatRoomExitResponse> exitChatRoom(
            @PathVariable("roomId") Long roomId,
            @AuthMember Long memberId
    ){
        return ResponseEntity.ok(chatRoomService.exitRoom(roomId, memberId));
    }

    @PostMapping("/room/{roomId}/left")
    public ResponseEntity<String> leftChatRoom(
            @PathVariable("roomId") Long roomId,
            @AuthMember Long memberId
    ){
        return ResponseEntity.ok(chatRoomService.leftRoom(roomId, memberId));
    }

}