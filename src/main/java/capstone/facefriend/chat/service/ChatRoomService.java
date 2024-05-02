package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomEmptyResponse;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomHeartResponse;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomMessageResponse;
import capstone.facefriend.chat.service.dto.chatroom.ChatRoomOpenResponse;
import capstone.facefriend.chat.service.dto.heart.GetSendHeartResponse;
import capstone.facefriend.member.domain.member.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private static final String EMPTY_MESSAGE = "채팅을 시작하지 않았습니다.";
    private static final String OPEN_MESSAGE = "채팅을 시작해보세요!";

    private List<ChatRoomMember> findAllChatRoomMemberBySenderId(Long memberId) {
        return chatRoomMemberRepository.findAllBySenderId(memberId).orElse(new ArrayList<>());
    }

    private List<ChatRoomMember> findAllChatRoomMemberByReceiverId(Long memberId) {
        return chatRoomMemberRepository.findAllByReceiverId(memberId).orElse(new ArrayList<>());
    }

    @Transactional
    public Map<String, Object> getChatRoomList(Long memberId) {

        List<ChatRoomMember> chatRoomMemberList = new ArrayList<>();
        chatRoomMemberList.addAll(findAllChatRoomMemberByReceiverId(memberId));
        chatRoomMemberList.addAll(findAllChatRoomMemberBySenderId(memberId));

        Map<String, Object> chatRooms = new HashMap<>();

        if (chatRoomMemberList.isEmpty()) {
            ChatRoomEmptyResponse chatRoomEmptyResponse = ChatRoomEmptyResponse.of(EMPTY_MESSAGE);
            chatRooms.put("chatRoomList", chatRoomEmptyResponse);
            return chatRooms;
        }

        List<ChatRoomMessageResponse> chatRoomsMessage = new ArrayList<>();
        List<ChatRoomHeartResponse> chatRoomsHeart = new ArrayList<>();
        List<ChatRoomOpenResponse> chatRoomsOpen = new ArrayList<>();

        for (ChatRoomMember chatRoomMember : chatRoomMemberList) {
            ChatRoom.Status status = chatRoomMember.getChatRoom().getStatus();

            if (status == ChatRoom.Status.set) {
                GetSendHeartResponse sendHeartResponse = new GetSendHeartResponse();
                sendHeartResponse.setType("Heart");
                sendHeartResponse.setRoomId(chatRoomMember.getChatRoom().getId());
                sendHeartResponse.setSenderId(chatRoomMember.getSender().getId());
                sendHeartResponse.setReceiveId(chatRoomMember.getReceiver().getId());
                sendHeartResponse.setSenderName(chatRoomMember.getSender().getBasicInfo().getNickname());
                log.info("sendHeart:{}", sendHeartResponse.toString());
                ChatRoomHeartResponse chatRoomHeartResponse = ChatRoomHeartResponse.of(chatRoomMember, sendHeartResponse);
                chatRoomsHeart.add(chatRoomHeartResponse);

            } else if (status == ChatRoom.Status.progress) {
                ChatMessage chatMessage = chatMessageRepository.findFirstByChatRoomIdOrderBySendTimeDesc(chatRoomMember.getChatRoom().getId());
                ChatRoomMessageResponse chatRoomResponse = ChatRoomMessageResponse.of(chatRoomMember, chatMessage);
                chatRoomsMessage.add(chatRoomResponse);

            } else if (status == ChatRoom.Status.open) {
                Member Sender = chatRoomMember.getSender();
                ChatRoomOpenResponse chatRoomOpenResponse = ChatRoomOpenResponse.of(Sender.getId(), Sender.getBasicInfo().getNickname(), OPEN_MESSAGE);
                chatRoomsOpen.add(chatRoomOpenResponse);
            }
        }

        chatRooms.put("chatRoomHeartList", chatRoomsHeart);
        chatRooms.put("chatRoomMessageList", chatRoomsMessage);
        chatRooms.put("chatRoomOpenList", chatRoomsOpen);

        return chatRooms;
    }
}
