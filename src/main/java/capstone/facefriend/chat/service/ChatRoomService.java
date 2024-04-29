package capstone.facefriend.chat.service;


import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomRepository;
import capstone.facefriend.chat.domain.dto.RequestChatRoom;
import capstone.facefriend.chat.domain.dto.ResponseChatRooms;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static capstone.facefriend.chat.exception.ChatExceptionType.*;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public Long createChatRoom(Long memberId, RequestChatRoom requestChatRoom) {
        ChatRoom chatRoom = chatRoomRepository.save(requestChatRoom.toEntity(memberId));
        return chatRoom.getId();
    }

    // 본인이 참여 중인 채팅방 모두 조회
    public ResponseChatRooms getChatRooms(Long memberId) {
        List<ChatRoom> chatRoomList = chatRoomRepository.findAllByMasterIdOrInviterId(memberId, memberId);
        return ResponseChatRooms.builder().chatRoomList(chatRoomList).build();
    }

    // 본인이 참여 중인 채팅방 상세 조회
    public ChatRoom getChatRoom(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ChatException(NOT_FOUND));
        return chatRoom;
    }

    @Transactional
    public void deleteChatRoom(Long memberId, Long chatRoomId) {
        chatRoomRepository.deleteChatRoomByMasterIdAndId(memberId, chatRoomId);
    }
}
