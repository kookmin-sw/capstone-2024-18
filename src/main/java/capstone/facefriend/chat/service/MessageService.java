package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.infrastructure.repository.ChatMessageRepository;
import capstone.facefriend.chat.infrastructure.repository.ChatRoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageResponse;
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

import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisTemplate redisTemplate;
    private final ChannelTopic channelTopic;

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }

    private ChatRoom findRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(()-> new RuntimeException("not found"));
        return chatRoom;
    }

    @Transactional
    public void sendMessage(MessageRequest messageRequest) {

        ChatMessage chatMessage = ChatMessage.builder()
                .content(messageRequest.getContent())
                .sender(findMemberById(messageRequest.getSenderId()))
                .chatRoom(findRoomById(messageRequest.getRoomId()))
                .sendTime(LocalDateTime.now())
                .isRead(false)
                .build();

        chatMessageRepository.save(chatMessage);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setRoomId(chatMessage.getChatRoom().getId());
        messageResponse.setSenderId(chatMessage.getSender().getId());
        messageResponse.setContent(chatMessage.getContent());
        messageResponse.setCreatedAt(chatMessage.getSendTime());
        messageResponse.setIsRead(chatMessage.isRead());

        String topic = channelTopic.getTopic();

        redisTemplate.convertAndSend(topic, messageResponse);

    }

}