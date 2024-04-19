package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.infrastructure.repository.dto.ChatRoomRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.ChatRoomResponse;
import capstone.facefriend.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;


    @PostMapping("/set-room")
    public ResponseEntity<ChatRoomResponse> setRoom(
            @AuthMember Long senderId,
            @RequestBody Long receiveId
    ) {
        return ResponseEntity.ok(chatRoomService.setRoom(senderId, receiveId));
    }

    @PutMapping("/permit-reqeust")
    public ResponseEntity<ChatRoomResponse> putRoom(
            @RequestBody ChatRoomRequest chatRoomRequest
    ){
        return ResponseEntity.ok(chatRoomService.putRoom(chatRoomRequest));
    }
}
