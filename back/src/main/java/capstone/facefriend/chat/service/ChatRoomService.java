package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomInfo;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomInfoRedisRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.repository.ChatRoomRepository;
import capstone.facefriend.chat.service.dto.chatroom.*;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static capstone.facefriend.chat.domain.ChatRoom.*;
import static capstone.facefriend.chat.domain.ChatRoom.Status.*;
import static capstone.facefriend.chat.exception.ChatExceptionType.NOT_FOUND_CHAT_ROOM;
import static capstone.facefriend.chat.exception.ChatExceptionType.NOT_FOUND_CHAT_ROOM_MEMBER;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatRoomService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomInfoRedisRepository chatRoomInfoRedisRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    
    private static final String EMPTY_MESSAGE = "채팅을 시작하지 않았습니다.";
    private static final String OPEN_MESSAGE = "채팅을 시작해보세요!";
    private static final String CLOSE_MESSAGE = "상대방이 떠났습니다.";

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }

    private List<ChatRoomMember> findAllChatRoomMemberBySenderId(Long memberId) {
        return chatRoomMemberRepository.findAllBySenderId(memberId).orElse(new ArrayList<>());
    }

    private List<ChatRoomMember> findAllChatRoomMemberByReceiverId(Long memberId) {
        return chatRoomMemberRepository.findAllByReceiverId(memberId).orElse(new ArrayList<>());
    }
    
    private ChatRoom findRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(()-> new ChatException(NOT_FOUND_CHAT_ROOM));
        return chatRoom;
    }

    private ChatRoomMember findChatRoomMemberByChatRoomId(Long roomId) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findByChatRoomId(roomId)
                .orElseThrow(()-> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER));
        return chatRoomMember;
    }

    private List<ChatMessage> findChatRoomMessageByChatRoomId(Long roomId) {
        return chatMessageRepository.findChatMessagesByChatRoomId(roomId);
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
        List<ChatRoomCloseResponse> chatRoomClose = new ArrayList<>();

        Member member = findMemberById(memberId);

        for (ChatRoomMember chatRoomMember : chatRoomMemberList) {
            Status status = chatRoomMember.getChatRoom().getStatus();

            if (status == SET) {
                createChatRoomHeartResponse(memberId, chatRoomsHeart, member, chatRoomMember);
            }

            if (status == PROGRESS) {
                createChatRoomMessageResponse(memberId, chatRoomsMessage, member, chatRoomMember);
            } 
            
            if (status == OPEN) {
                createChatRoomOpenResponse(memberId, chatRoomsOpen, member, chatRoomMember);
            }

            if (status == CLOSE) {
                createChatRoomCloseResponse(memberId, chatRoomClose, member, chatRoomMember);
            }
        }

        chatRooms.put("chatRoomHeartList", chatRoomsHeart);
        chatRooms.put("chatRoomMessageList", chatRoomsMessage);
        chatRooms.put("chatRoomOpenList", chatRoomsOpen);
        chatRooms.put("chatRoomCloseList", chatRoomClose);

        return chatRooms;
    }

    private void createChatRoomCloseResponse(Long memberId, List<ChatRoomCloseResponse> chatRoomClose, Member member, ChatRoomMember chatRoomMember) {
        Member leftMember = identifyLeftMember(memberId, chatRoomMember);

        if (member != leftMember) {
            ChatRoomCloseResponse chatRoomCloseResponse = ChatRoomCloseResponse.of(member, chatRoomMember.getChatRoom(), CLOSE_MESSAGE);
            chatRoomClose.add(chatRoomCloseResponse);
        }
    }

    private void createChatRoomOpenResponse(Long memberId, List<ChatRoomOpenResponse> chatRoomsOpen, Member member, ChatRoomMember chatRoomMember) {
        String memberFaceInfo;
        String senderFaceInfo;

        Member sender = identifySender(chatRoomMember, memberId);
        Boolean isSender = isSender(chatRoomMember, memberId);

        if(isSender == true) {
            memberFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
        } else {
            memberFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
        }

        ChatRoomOpenResponse chatRoomOpenResponse = ChatRoomOpenResponse.of(member, sender, chatRoomMember.getChatRoom(), senderFaceInfo, memberFaceInfo, OPEN_MESSAGE);
        chatRoomsOpen.add(chatRoomOpenResponse);
    }

    private void createChatRoomMessageResponse(Long memberId, List<ChatRoomMessageResponse> chatRoomsMessage, Member member, ChatRoomMember chatRoomMember) {
        String memberFaceInfo;
        String senderFaceInfo;

        Member sender = identifySender(chatRoomMember, memberId);
        ChatMessage chatMessage = chatMessageRepository.findFirstByChatRoomIdOrderBySendTimeDesc(chatRoomMember.getChatRoom().getId());
        Boolean isSender = isSender(chatRoomMember, memberId);

        if(isSender == true) {
            memberFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
        } else {
            memberFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
        }

        ChatRoomMessageResponse chatRoomResponse = ChatRoomMessageResponse.of(member, sender, chatRoomMember.getChatRoom(), senderFaceInfo, memberFaceInfo, chatMessage);
        chatRoomsMessage.add(chatRoomResponse);
    }

    private void createChatRoomHeartResponse(Long memberId, List<ChatRoomHeartResponse> chatRoomsHeart, Member member, ChatRoomMember chatRoomMember) {
        String memberFaceInfo;
        String senderFaceInfo;

        Member sender = identifySender(chatRoomMember, memberId);
        Boolean isSender = isSender(chatRoomMember, memberId);

        if(isSender == true) {
            memberFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
        } else {
            memberFaceInfo = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
            senderFaceInfo = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
        }

        ChatRoomHeartResponse chatRoomHeartResponse = ChatRoomHeartResponse.of(member, sender, chatRoomMember.getChatRoom(), senderFaceInfo, memberFaceInfo,isSender);
        chatRoomsHeart.add(chatRoomHeartResponse);
    }

    @Transactional
    public String leftRoom(Long roomId, Long memberId) {

        ChatRoom chatRoom = findRoomById(roomId);
        Status status = chatRoom.getStatus();
        ChatRoomMember chatRoomMember = findChatRoomMemberByChatRoomId(roomId);
        Member member = findMemberById(memberId);
        Member sender = identifySender(chatRoomMember, memberId);
        Member leftMember = identifyLeftMember(memberId, chatRoomMember);

        if (status == CLOSE) {
            if (member != leftMember) {
                chatRoomMemberRepository.delete(chatRoomMember);
                chatRoomRepository.delete(chatRoom);
                return "채팅방을 떠났습니다.";
            } else {
                return "이미 떠난 채팅방입니다.";
            }
        }
        List<ChatMessage> chatMessages = findChatRoomMessageByChatRoomId(roomId);

        if (!chatMessages.isEmpty()){
            chatMessageRepository.deleteAll(chatMessages);
        }

        if (chatRoomMember.getSender().equals(member)) {
            chatRoomMember.setSenderExist(false);
        } else if (chatRoomMember.getReceiver().equals(member)){
            chatRoomMember.setReceiverExist(false);
        } else {
            return "속해있지 않은 채팅방입니다.";
        }

        chatRoom.setStatus(CLOSE);
        String content = "상대방이 떠났습니다.";
        String method = "receiveLeftRoom";
        LocalDateTime sendTime = LocalDateTime.now();
        ChatRoomLeftResponse chatRoomLeftResponse = ChatRoomLeftResponse.of(method, roomId, leftMember, sendTime, content);

        simpMessagingTemplate.convertAndSend("/sub/chat/" + sender.getId(),chatRoomLeftResponse);
        chatRoomRepository.save(chatRoom);
        chatRoomMemberRepository.save(chatRoomMember);

        return "채팅방을 떠났습니다";
    }

    private Member identifySender(ChatRoomMember chatRoomMember, Long memberId) {
        Member member = findMemberById(memberId);

        if (member.getId().equals(chatRoomMember.getSender().getId())) {
            return chatRoomMember.getReceiver();
        }

        return chatRoomMember.getSender();
    }

    private Member identifyLeftMember(Long memberId, ChatRoomMember chatRoomMember) {
        Member member = findMemberById(memberId);

        if (chatRoomMember.getSender() == member) {
            if (chatRoomMember.isSenderExist()) {
                return chatRoomMember.getReceiver();
            }
        } else {
            if (chatRoomMember.isReceiverExist()) {
                return chatRoomMember.getSender();
            }
        }

        return member;
    }

    private Boolean isSender(ChatRoomMember chatRoomMember, Long memberId) {
        Member member = findMemberById(memberId);

        if (member.getId().equals(chatRoomMember.getSender().getId())) {
            return true;
        }
        return false;
    }
}