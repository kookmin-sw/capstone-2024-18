package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.infrastructure.repository.ChatMessageRepository;
import capstone.facefriend.chat.infrastructure.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.infrastructure.repository.ChatRoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageResponse;
import capstone.facefriend.chat.infrastructure.repository.dto.SendHeartResponse;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisTemplate<String, Object> redisTemplate; // RedisTemplate의 제네릭 타입을 String, Object로 지정
    private final ChannelTopic channelTopic;

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }

    private ChatRoom findRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("not found"));
        return chatRoom;
    }

    @Transactional
    public void sendHeart(Long senderId, Long receiveId, String destination, String sessionId) {

        ChatRoom chatRoom = ChatRoom.builder()
                .status(ChatRoom.Status.set)
                .isPublic(false)
                .build();
        chatRoomRepository.save(chatRoom);

        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(receiveId);
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
        sendHeartResponse.setSenderName(sender.getNickname());
        sendHeartResponse.setReceiveId(receiveId);
        sendHeartResponse.setSessionId(sessionId);
        sendHeartResponse.setType("Heart");

        // true라면 보내기
        String topic = channelTopic.getTopic();
        redisTemplate.convertAndSend(topic, sendHeartResponse);
    }

    @Transactional
    public void sendMessage(MessageRequest messageRequest, Long senderId) {

        ChatMessage chatMessage = ChatMessage.builder()
                .content(messageRequest.getContent())
                .sender(findMemberById(senderId))
                .chatRoom(findRoomById(messageRequest.getRoomId()))
                .sendTime(LocalDateTime.now())
                .isRead(false)
                .build();

        chatMessageRepository.save(chatMessage);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setRoomId(chatMessage.getChatRoom().getId());
        messageResponse.setReceiveId(messageRequest.getReceiveId());
        messageResponse.setSenderId(senderId);
        messageResponse.setContent(chatMessage.getContent());
        messageResponse.setCreatedAt(chatMessage.getSendTime());
        messageResponse.setIsRead(chatMessage.isRead());
        messageResponse.setType("message");

        String topic = channelTopic.getTopic();

        redisTemplate.convertAndSend(topic, messageResponse);

    }
    public void sendSentMessage(Long receiveId) {
        String destination = "/sub/chat/" + receiveId;
        List<Object> messages = new ArrayList<>();
        Long messagesListSize = redisTemplate.opsForList().size(destination);

        if (messagesListSize > 0) {
            for (Long i = messagesListSize; i>0; i--) {
                messages.add(redisTemplate.opsForList().leftPop(destination));
            }
        }
        for (Object msg: messages) {
            String topic = channelTopic.getTopic();
            redisTemplate.convertAndSend(topic, msg);
        }
    }

}
