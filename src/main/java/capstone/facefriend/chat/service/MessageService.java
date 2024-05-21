package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.*;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import capstone.facefriend.chat.repository.*;
import capstone.facefriend.chat.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.chat.service.dto.heart.HeartReplyResponse;
import capstone.facefriend.chat.service.dto.heart.SendHeartResponse;
import capstone.facefriend.chat.service.dto.message.MessageListRequest;
import capstone.facefriend.chat.service.dto.message.MessageListResponse;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import capstone.facefriend.chat.service.dto.message.MessageResponse;
import capstone.facefriend.member.domain.faceInfo.FaceInfoByLevel;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import static capstone.facefriend.chat.exception.ChatExceptionType.*;
import static capstone.facefriend.member.exception.member.MemberExceptionType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final SocketInfoRedisRepository socketInfoRedisRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomInfoRedisRepository chatRoomInfoRedisRepository;

    private Member findMemberById(String destination, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElse(null);
        if (member == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND.message());
            throw new MemberException(NOT_FOUND);
        }

        return member;
    }

    private ChatRoom findRoomById(String destination, Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElse(null);
        if (chatRoom == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_CHAT_ROOM.message());
            throw new ChatException(NOT_FOUND_CHAT_ROOM);
        }
        return chatRoom;
    }

    private ChatRoomMember findSenderReceiver(String destination, Long senderId, Long receiveId) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findBySenderAndReceiver(senderId, receiveId)
                .orElse(null);
        if (chatRoomMember == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_CHAT_ROOM_MEMBER.message());
            throw new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER);
        }
        return chatRoomMember;
    }

    private ChatRoomMember findChatRoomMemberByChatRoomId(String destination, Long roomId) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findByChatRoomId(roomId)
                .orElse(null);
        if (chatRoomMember == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_CHAT_ROOM_MEMBER.message());
            throw new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER);
        }
        return chatRoomMember;
    }

    private SocketInfo findSocketInfo(Long memberId) {
        SocketInfo socketInfo = socketInfoRedisRepository.findById(memberId)
                .orElseThrow(()-> new ChatException(FAIL_TO_SOCKET_INFO));
        return socketInfo;
    }

    private ChatRoomInfo findChatRoomInfo(String chatRoomInfoId) {
        ChatRoomInfo chatRoomInfo = chatRoomInfoRedisRepository.findById(chatRoomInfoId)
                .orElseThrow(()-> new ChatException(NOT_FOUND_CHAT_ROOM));
        return chatRoomInfo;
    }

    @Transactional
    public void sendMessage(MessageRequest messageRequest, Long senderId) {
        String exceptionDestination = "/sub/chat/" + senderId;
        Member sender = findMemberById(exceptionDestination, senderId);
        Member receiver = findMemberById(exceptionDestination, messageRequest.getReceiveId());
        ChatRoom chatRoom = findRoomById(exceptionDestination, messageRequest.getRoomId());

        if (chatRoom.getStatus() == ChatRoom.Status.open) {
            chatRoom.setStatus(ChatRoom.Status.progress);
            ChatRoomMember chatRoomMember = findChatRoomMemberByChatRoomId(exceptionDestination, chatRoom.getId());
            chatRoomRepository.save(chatRoom);
            chatRoomMemberRepository.save(chatRoomMember);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.close)) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_CHATROOM.message());
            throw new ChatException(INVALIDED_CHATROOM);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.set)) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_CHATROOM.message());
            throw new ChatException(INVALIDED_CHATROOM);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.delete)) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_CHATROOM.message());
            throw new ChatException(INVALIDED_CHATROOM);
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .content(messageRequest.getContent())
                .sender(sender)
                .chatRoom(chatRoom)
                .sendTime(LocalDateTime.now())
                .isRead(false)
                .build();
        chatMessageRepository.save(chatMessage);

        ChatRoomMember chatRoomMember = findChatRoomMember(chatRoom); // 영속

        // getSender() 는 하트틀 보내는 사람(방 개설자)을 의미
        // senderId() 는 메세지를 보내는 사람을 의미
        MessageResponse messageResponse = new MessageResponse();
        if (chatRoomMember.getSender().equals(sender)) {
            messageResponse.setMethod("receiveChat");
            messageResponse.setRoomId(chatMessage.getChatRoom().getId());
            messageResponse.setSenderId(senderId);
            messageResponse.setReceiveId(receiver.getId());
            messageResponse.setSenderNickname(sender.getBasicInfo().getNickname());
            messageResponse.setSenderFaceInfoS3Url(chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url()); // 수정한 부분
            messageResponse.setContent(chatMessage.getContent());
            messageResponse.setType("message");
            messageResponse.setCreatedAt(chatMessage.getSendTime());
            messageResponse.setIsRead(chatMessage.isRead());
        }

        if (chatRoomMember.getReceiver().equals(sender)) {
            messageResponse.setMethod("receiveChat");
            messageResponse.setRoomId(chatMessage.getChatRoom().getId());
            messageResponse.setSenderId(senderId);
            messageResponse.setReceiveId(receiver.getId());
            messageResponse.setSenderNickname(sender.getBasicInfo().getNickname());
            messageResponse.setSenderFaceInfoS3Url(chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url()); // 수정한 부분
            messageResponse.setContent(chatMessage.getContent());
            messageResponse.setType("message");
            messageResponse.setCreatedAt(chatMessage.getSendTime());
            messageResponse.setIsRead(chatMessage.isRead());
        }

        String topic = channelTopic.getTopic();

        redisTemplate.convertAndSend(topic, messageResponse);

    }

    private ChatRoomMember findChatRoomMember(ChatRoom chatRoom) {
        return chatRoomMemberRepository.findByChatRoomId(chatRoom.getId()).orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER));
    }

    @Transactional
    public void sendHeart(Long senderId, Long receiveId) {
        String exceptionDestination = "/sub/chat/" + senderId;

        if (chatRoomMemberRepository.findBySenderAndReceiver(senderId, receiveId).isPresent()){
            String exceptionMessage = ALREADY_CHATROOM.message();
            simpMessagingTemplate.convertAndSend(exceptionDestination, exceptionMessage);
            throw new ChatException(ALREADY_CHATROOM);
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .status(ChatRoom.Status.set)
                .isPublic(false)
                .build();
        chatRoomRepository.save(chatRoom);

        Member sender = findMemberById(exceptionDestination, senderId);
        Member receiver = findMemberById(exceptionDestination, receiveId);

        ChatRoomMember chatRoomMember = ChatRoomMember.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .senderFaceInfoByLevel( // faceInfoByLevel is initialized by generated
                        FaceInfoByLevel.builder()
                                .generatedByLevelS3url(sender.getFaceInfo().getGeneratedS3url()) // since generated is level 1
                                .build()
                )
                .receiver(receiver)
                .receiverFaceInfoByLevel( // faceInfoByLevel is initialized by generated
                        FaceInfoByLevel.builder()
                                .generatedByLevelS3url(receiver.getFaceInfo().getGeneratedS3url()) // since generated is level 1
                                .build()
                )
                .isSenderExist(true)
                .isReceiverExist(true)
                .isSenderPublic(false)
                .isReceiverPublic(false)
                .build();

        chatRoomMemberRepository.save(chatRoomMember);

        SendHeartResponse sendHeartResponse = new SendHeartResponse();
        sendHeartResponse.setMethod("receiveHeart");
        sendHeartResponse.setMemberId(receiveId);
        sendHeartResponse.setSenderName(sender.getBasicInfo().getNickname());
        sendHeartResponse.setSenderId(sender.getId());
        sendHeartResponse.setType("Heart");
        sendHeartResponse.setSenderOriginS3url(sender.getFaceInfo().getOriginS3url());
        sendHeartResponse.setSenderGeneratedS3url(sender.getFaceInfo().getGeneratedS3url());
        sendHeartResponse.setChatRoom(chatRoom);
        sendHeartResponse.setCreatedAt(LocalDateTime.now());
        sendHeartResponse.setSender(false);

        String topic = channelTopic.getTopic();
        simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 요청 성공");
        redisTemplate.convertAndSend(topic, sendHeartResponse);
    }

    private ChatRoomMember findChatRoomMemberBySenderAndReceiver(Member sender, Member receiver) {
        return chatRoomMemberRepository.findChatRoomMemberBySenderAndReceiver(sender, receiver).orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER));
    }

    @Transactional
    public void heartReply(HeartReplyRequest heartReplyRequest, Long receiveId) {
        String exceptionDestination = "/sub/chat/" + receiveId;

        Member receiver = findMemberById(exceptionDestination, receiveId);
        Member sender = findMemberById(exceptionDestination, heartReplyRequest.senderId());

        ChatRoomMember chatRoomMember = findSenderReceiver(exceptionDestination, sender.getId(), receiver.getId());
        ChatRoom chatRoom = findRoomById(exceptionDestination, chatRoomMember.getChatRoom().getId());

        if (heartReplyRequest.intention().equals("positive")) {
            chatRoom.setStatus(ChatRoom.Status.open);
            chatRoomRepository.save(chatRoom);
            chatRoomMemberRepository.save(chatRoomMember);

            // 대화 수락
            simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 수락");

        } else if (heartReplyRequest.intention().equals("negative")) {
            chatRoomMemberRepository.delete(chatRoomMember);
            chatRoomRepository.delete(chatRoom);
            // 대화 거절
            simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 거절");

        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, ALREADY_CHATROOM);
            throw new ChatException(ALREADY_CHATROOM);
        }
        // 동적으로 목적지 설정
        String destination = "/sub/chat/" + sender.getId();

        String method = "receiveHeartResponse";

        HeartReplyResponse heartReplyResponse = HeartReplyResponse.of(receiveId, heartReplyRequest, method);

        // 메시지 전송
        simpMessagingTemplate.convertAndSend(destination, heartReplyResponse);
    }

    public List<MessageListResponse> getMessagePage(Long roomId, int pageNo, MessageListRequest messageListRequest) {
        pageNo = pageNo - 1;
        int pageSize = 40;
        Sort sort = Sort.by(Sort.Direction.DESC, "sendTime");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        LocalDateTime time2 = messageListRequest.sendTime();
        List<ChatMessage> chatMessagePage = chatMessageRepository.findChatMessagesByChatRoom_IdAndSendTimeBefore(roomId, time2, pageable);
        List<MessageListResponse> messageListResponses = new ArrayList<>();
        for (ChatMessage chatMessage : chatMessagePage){
            MessageListResponse messageListResponse = MessageListResponse.of(chatMessage);
            messageListResponses.add(messageListResponse);
        }
        return messageListResponses;
    }

    @Transactional
    public void enterApplication(Long memberId) {
        String exceptionDestination = "/sub/chat/" + memberId;
        SocketInfo socketInfo = new SocketInfo();
        socketInfo.setMemberId(memberId);
        socketInfo.setConnectTime(LocalDateTime.now());
        socketInfoRedisRepository.save(socketInfo);
        if (isExistUnReadMessage(memberId)) {
            sendSentMessage(memberId);
        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, "큐잉된 메시지가 없습니다.");
        }

        if(isExistUnSendHeart(memberId)) {
            sendSentHeart(exceptionDestination, memberId);
        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, "큐잉된 대화요청이 없습니다.");
        }

        simpMessagingTemplate.convertAndSend(exceptionDestination, "저장 성공");
    }

    @Transactional
    public String exitApplication(Long memberId) {
        SocketInfo socketInfo = findSocketInfo(memberId);
        socketInfoRedisRepository.delete(socketInfo);
        return "성공";
    }

    private Boolean isExistUnReadMessage(Long memberId) {
        Boolean isUnRead = redisTemplate.hasKey("/sub/chat/" + memberId + "message");
        log.info(isUnRead.toString());
        return !isUnRead;
    }

    private Boolean isExistUnSendHeart(Long memberId) {
        Boolean isUnRead = redisTemplate.hasKey("/sub/chat/" + memberId + "SendHeart");
        log.info(isUnRead.toString());
        return !isUnRead;
    }

    private void sendSentMessage(Long receiveId) {
        String topic = channelTopic.getTopic();
        String destination = "/sub/chat" + receiveId + "message";
        List<Object> messages = redisTemplate.opsForList().range(destination, 0, -1);
        Long messagesListSize = (messages != null) ? (long) messages.size() : 0;
        log.info("Message list size: {}", messagesListSize);

        if (messagesListSize > 0) {
            for (Object messageObj : messages) {
                LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) messageObj;
                MessageResponse messageResponse = new MessageResponse(map);
                log.info("UnReadMessageResponse: {}", messageResponse.toString());
                redisTemplate.convertAndSend(topic, messageResponse);
            }
            // 리스트 비우기
            redisTemplate.delete(destination);
            log.info("Message list cleared.");
        } else {
            log.warn("Message list is empty.");
        }
    }






    private void sendSentHeart(String exceptionDestination, Long receiveId) {
        String topic = channelTopic.getTopic();
        String destination = "/sub/chat" + receiveId + "heart";
        List<Object> sendHearts = redisTemplate.opsForList().range(destination, 0, -1);
        Long messagesListSize = (sendHearts != null) ? (long) sendHearts.size() : 0;
        log.info("Message list size: {}", messagesListSize);

        if (messagesListSize > 0) {
            for (Object sendHeartObj : sendHearts) {
                LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) sendHeartObj;
                LinkedHashMap<String, Object> chatRoomMap = (LinkedHashMap<String, Object>) map.get("chatRoom");
                Long roomId = ((Number) chatRoomMap.get("id")).longValue();
                ChatRoom chatRoom = findRoomById(exceptionDestination, roomId);
                SendHeartResponse sendHeartResponse = new SendHeartResponse(map, chatRoom);
                log.info("UnReadSendHeartResponse: {}", sendHeartResponse.toString());
                redisTemplate.convertAndSend(topic, sendHeartResponse);
            }
            // 리스트 비우기
            redisTemplate.delete(destination);
            log.info("Sendheart list cleared.");
        } else {
            log.warn("Sendheart list is empty.");
        }
    }

    private Member findMemberByid(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }
}