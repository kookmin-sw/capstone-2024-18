package capstone.facefriend.chat.controller;

import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageDto;
import capstone.facefriend.chat.service.MessageService;
import capstone.facefriend.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final RoomService roomService;
    private final MappingJackson2HttpMessageConverter converter;


    @MessageMapping("/test")
    @SendTo("/sub/test")
    public String test() {
        return "테스트 자동화 했다고 왜 안돼? 자동으로 되는 거 이제?";
    }



    @MessageMapping("/chats/messages")
    public void message(
            @RequestBody String name,
            @RequestBody String messageDtoJson
    ) {
        Room room = roomService.setRoom(name);
        try {
            MessageDto messageDto = converter.getObjectMapper().readValue(messageDtoJson, MessageDto.class);
            messageDto.setRoomId(room.getId());
            messageService.sendMessage(messageDto);
        } catch (IOException e) {
            log.error("Failed to parse MessageDto JSON: {}", e.getMessage());
            // 예외 처리
        }
    }

}