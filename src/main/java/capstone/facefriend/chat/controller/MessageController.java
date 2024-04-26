package capstone.facefriend.chat.controller;

import capstone.facefriend.chat.infrastructure.repository.dto.MessageRequest;
import capstone.facefriend.chat.service.ChatRoomService;
import capstone.facefriend.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final ChatRoomService chatRoomService;
    private final MappingJackson2HttpMessageConverter converter;


    @MessageMapping("/test")
    @SendTo("/sub/test")
    public String test() {
        return "테스트 자동화 했다고 왜 안돼? 자동으로 되는 거 이제?";
    }

//    @MessageMapping("/send-heart")
//    public void sendheart(
//            @RequestBody SendHeartRequest sendHeartRequest
//    ){
//
//    }

    @MessageMapping("/chat/messages")
    public void message(
            MessageRequest messageRequest
            ) {
        messageService.sendMessage(messageRequest);
    }

}