package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.domain.SocketInfo;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.repository.ChatRoomRepository;
import capstone.facefriend.chat.repository.SocketInfoRedisRepository;
import capstone.facefriend.chat.service.dto.heart.GetSendHeartResponse;
import capstone.facefriend.chat.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.chat.service.dto.heart.SendHeartResponse;
import capstone.facefriend.chat.service.dto.message.GetMessageResponse;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import capstone.facefriend.chat.service.dto.message.MessageResponse;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.List;

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
    private final ObjectMapper objectMapper;

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
        return member;
    }

    private ChatRoom findRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(()-> new ChatException(ChatExceptionType.NOT_FOUND));
        return chatRoom;
    }

        private ChatRoomMember findSenderReceiver(Long senderId, Long receiveId) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findBySenderAndReceiver(senderId, receiveId)
                .orElseThrow(()-> new ChatException(ChatExceptionType.NOT_FOUND));
        return chatRoomMember;
    }

    private ChatRoomMember findbyRoomId(Long roomId) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findByChatRoomId(roomId)
                .orElseThrow(()-> new ChatException(ChatExceptionType.NOT_FOUND));
        return chatRoomMember;
    }

    private SocketInfo findSocketInfo(Long memberId) {
        SocketInfo socketInfo = socketInfoRedisRepository.findById(memberId)
                .orElseThrow(()-> new ChatException(ChatExceptionType.NOT_FOUND));
        return socketInfo;
    }


    @Transactional
    public void sendMessage(MessageRequest messageRequest, Long senderId) {
        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(messageRequest.getReceiveId());
        ChatRoom chatRoom = findRoomById(messageRequest.getRoomId());

        if (chatRoom.getStatus() == ChatRoom.Status.open) {
            chatRoom.setStatus(ChatRoom.Status.progress);
            ChatRoomMember chatRoomMember = findbyRoomId(chatRoom.getId());
            chatRoomRepository.save(chatRoom);
            chatRoomMemberRepository.save(chatRoomMember);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.close)) {
            throw new ChatException(ChatExceptionType.INVALIDED_CHATROOM);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.set)) {
            throw new ChatException(ChatExceptionType.INVALIDED_CHATROOM);
        } else if ((chatRoom.getStatus() == ChatRoom.Status.delete)) {
            throw new ChatException(ChatExceptionType.INVALIDED_CHATROOM);
        }


        ChatMessage chatMessage = ChatMessage.builder()
                .content(messageRequest.getContent())
                .sender(sender)
                .chatRoom(chatRoom)
                .sendTime(LocalDateTime.now())
                .isRead(false)
                .build();

        chatMessageRepository.save(chatMessage);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setRoomId(chatMessage.getChatRoom().getId());
        messageResponse.setSenderId(senderId);
        messageResponse.setReceiveId(receiver.getId());
        messageResponse.setSenderNickname(sender.getBasicInfo().getNickname());
        messageResponse.setContent(chatMessage.getContent());
        messageResponse.setType("message");
        messageResponse.setCreatedAt(chatMessage.getSendTime());
        messageResponse.setIsRead(chatMessage.isRead());

        String topic = channelTopic.getTopic();

        redisTemplate.convertAndSend(topic, messageResponse);

    }
    @Transactional
    public void sendHeart(Long senderId, Long receiveId) {
        ChatRoom chatRoom = ChatRoom.builder()
                .status(ChatRoom.Status.set)
                .isPublic(false)
                .build();
        chatRoomRepository.save(chatRoom);

        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(receiveId);


        if (chatRoomMemberRepository.findBySenderAndReceiver(senderId, receiveId).isPresent())
            throw new ChatException(ChatExceptionType.ALREADY_CHATROOM);


        ChatRoomMember chatRoomMember = ChatRoomMember.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .receiver(receiver)
                .isSenderExist(false)
                .isReceiverExist(false)
                .isSenderPublic(false)
                .isReceiverPublic(false)
                .build();

        chatRoomMemberRepository.save(chatRoomMember);

        SendHeartResponse sendHeartResponse = new SendHeartResponse();
        sendHeartResponse.setRoomId(chatRoom.getId());
        sendHeartResponse.setSenderId(sender.getId());
        sendHeartResponse.setReceiveId(receiveId);
        sendHeartResponse.setSenderName(sender.getBasicInfo().getNickname());
        sendHeartResponse.setCreatedAt(LocalDateTime.now());
        sendHeartResponse.setType("Heart");

        String topic = channelTopic.getTopic();
        redisTemplate.convertAndSend(topic, sendHeartResponse);
    }
    @Transactional
    public void heartReply(HeartReplyRequest heartReplyRequest, Long receiveId) {
        String message = null;

        Member receiver = findMemberById(receiveId);
        Member sender = findMemberById(heartReplyRequest.getSenderId());

        ChatRoomMember chatRoomMember = findSenderReceiver(sender.getId(), receiver.getId());
        ChatRoom chatRoom = findRoomById(chatRoomMember.getChatRoom().getId());

        if (heartReplyRequest.getIntention().equals("positive")) {
            chatRoom.setStatus(ChatRoom.Status.open);
            chatRoomRepository.save(chatRoom);
            chatRoomMemberRepository.save(chatRoomMember);

            message = receiver.getBasicInfo().getNickname() + "님이 수락했습니다.";
        } else if (heartReplyRequest.getIntention().equals("negative")) {
            chatRoomMemberRepository.delete(chatRoomMember);
            chatRoomRepository.delete(chatRoom);

            message = receiver.getBasicInfo().getNickname() + "님이 거절했습니다.";
        } else {
            throw new ChatException(ChatExceptionType.ALREADY_CHATROOM);
        }
        // 동적으로 목적지 설정
        String destination = "/sub/chat/" + sender.getId();

        // 메시지 전송
        simpMessagingTemplate.convertAndSend(destination, message);
    }


    @Transactional
    public void enterApplication(Long memberId) {
        SocketInfo socketInfo = new SocketInfo();
        socketInfo.setMemberId(memberId);
        socketInfo.setConnectTime(LocalDateTime.now());
        socketInfoRedisRepository.save(socketInfo);
        if (isExistUnReadMessage(memberId)) {
            sendSentMessage(memberId);
        }

        if(isExistUnSendHeart(memberId)) {
            sendSentHeart(memberId);
        }
    }

    @Transactional
    public void exitApplication(Long memberId) {
        SocketInfo socketInfo = findSocketInfo(memberId);
        socketInfoRedisRepository.delete(socketInfo);
    }

    public List<ChatMessage> getMessagePage(Long roomId, int pageNo) {
            pageNo = pageNo - 1;
            int pageSize = 20;
            Sort sort = Sort.by(Sort.Direction.DESC, "sendTime");
            Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
            List<ChatMessage> chatMessagePage = chatMessageRepository.findChatMessageByChatRoom(roomId, pageable);
            return chatMessagePage;
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
        List<MessageResponse> messages = new ArrayList<>();
        Long messagesListSize = redisTemplate.opsForList().size(destination);
        log.info(messagesListSize.toString());
        log.info("messageList: {}", redisTemplate.opsForList().range(destination, 0, -1));

        if (messagesListSize > 0) {
            for (Long i = messagesListSize; i>0; i--) {
                String jsonString = redisTemplate.opsForList().rightPop(destination).toString();
                try {
                    MessageResponse messageResponse = objectMapper.readValue(jsonString, MessageResponse.class);
                    log.info("messageResponse: {}", messageResponse.toString());
                    redisTemplate.convertAndSend(topic, messageResponse);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("Failed to process message", e);
                }
            }
        }
    }
    private void sendSentHeart(Long receiveId) {
        String topic = channelTopic.getTopic();
        String destination = "/sub/chat" + receiveId + "heart";
        List<SendHeartResponse> messages = new ArrayList<>();
        Long messagesListSize = redisTemplate.opsForList().size(destination);
        log.info("messagesListSize: {}", messagesListSize.toString());
        if (messagesListSize > 0) {
            for (Long i = messagesListSize; i>0; i--) {
                messages.add((SendHeartResponse) redisTemplate.opsForList().rightPop(destination));
            }
            for (Object msg: messages) {

                redisTemplate.convertAndSend(topic, msg);
            }
        }
    }

}