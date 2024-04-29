package capstone.facefriend.chat.service;


import capstone.facefriend.chat.domain.ChatRepository;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomRepository;
import capstone.facefriend.chat.domain.dto.ChatDto;
import capstone.facefriend.chat.domain.dto.ResponseChat;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public void saveMessage(ChatDto chatDto, Long memberId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatDto.getChatRoomId())
                .orElseThrow(() -> new ChatException(ChatExceptionType.NOT_FOUND));

        chatRepository.save(chatDto.toEntity(chatRoom, memberId));
    }

    public Page<ResponseChat> getChats(Long chatRoomId, Pageable pageable) {
        return chatRepository.getChats(chatRoomId, pageable);
    }
}
