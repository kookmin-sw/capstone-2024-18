package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.repository.ChatRoomRepository;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import capstone.facefriend.chat.service.dto.message.MessageResponse;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.exception.MemberExceptionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final RedisTemplate redisTemplate;
    private final ChannelTopic channelTopic;
    private final SimpMessagingTemplate messagingTemplate;

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


    @Transactional
    public void sendMessage(MessageRequest messageRequest, Long senderId) {
        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(messageRequest.getReceiveId());
        ChatRoomMember chatRoomMember = findSenderReceiver(sender.getId(), receiver.getId());
        ChatRoom chatRoom = findRoomById(messageRequest.getRoomId());

        if (chatRoom.getStatus() == ChatRoom.Status.open) {
            chatRoom.setStatus(ChatRoom.Status.progress);
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
        messageResponse.setContent(chatMessage.getContent());
        messageResponse.setType("message");
        messageResponse.setCreatedAt(chatMessage.getSendTime());
        messageResponse.setIsRead(chatMessage.isRead());

        String topic = channelTopic.getTopic();

        redisTemplate.convertAndSend(topic, messageResponse);

    }

}