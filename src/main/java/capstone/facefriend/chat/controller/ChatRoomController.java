package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}