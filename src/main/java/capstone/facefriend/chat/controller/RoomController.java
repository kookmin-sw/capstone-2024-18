package capstone.facefriend.chat.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.chat.infrastructure.repository.dto.RoomRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.RoomResponse;
import capstone.facefriend.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService roomService;
    @PostMapping("/send-request")
    public ResponseEntity<RoomResponse> setRoom(
            @AuthMember Long senderId,
            @RequestBody RoomRequest roomRequest,
            @RequestBody Long receiveId
    ) {
        return ResponseEntity.ok(roomService.setRoom(roomRequest, senderId, receiveId));
    }

    @PutMapping("/permit-reqeust")
    public ResponseEntity<RoomResponse> putRoom(
            @RequestBody RoomRequest roomRequest
    ){
        return ResponseEntity.ok(roomService.putRoom(roomRequest));
    }
}
