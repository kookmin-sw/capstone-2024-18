package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.repository.ChatRoomRepository;
import capstone.facefriend.chat.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.chat.service.dto.heart.SendHeartResponse;
import capstone.facefriend.chat.service.dto.message.MessageRequest;
import capstone.facefriend.chat.service.dto.message.MessageResponse;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
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
        log.info("-------------------send-heart---------------");
        redisTemplate.convertAndSend(topic, sendHeartResponse);
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
        messagingTemplate.convertAndSend(destination, message);
    }
}