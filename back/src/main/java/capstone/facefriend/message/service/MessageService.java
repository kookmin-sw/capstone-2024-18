package capstone.facefriend.message.service;

import static capstone.facefriend.message.domain.Room.Status.CLOSE;
import static capstone.facefriend.message.domain.Room.Status.DELETE;
import static capstone.facefriend.message.domain.Room.Status.OPEN;
import static capstone.facefriend.message.domain.Room.Status.PROGRESS;
import static capstone.facefriend.message.domain.Room.Status.SET;
import static capstone.facefriend.message.exception.MessageExceptionType.INVALIDED_ROOM;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM_MEMBER;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;

import capstone.facefriend.message.domain.Message;
import capstone.facefriend.message.domain.Room;
import capstone.facefriend.message.domain.RoomMember;
import capstone.facefriend.message.exception.MessageException;
import capstone.facefriend.message.repository.MessageRepository;
import capstone.facefriend.message.repository.RoomMemberRepository;
import capstone.facefriend.message.repository.RoomRepository;
import capstone.facefriend.message.service.dto.message.MessageListRequest;
import capstone.facefriend.message.service.dto.message.MessageListResponse;
import capstone.facefriend.message.service.dto.message.MessageRequest;
import capstone.facefriend.message.service.dto.message.MessageResponse;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.repository.MemberRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final MemberRepository memberRepository;
    private final RoomRepository roomRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final int PAGE_SIZE = 40;

    @Transactional
    public void sendMessage(MessageRequest messageRequest, Long senderId) {

        String exceptionDestination = "/sub/chat/" + senderId;
        Member sender = findMemberById(exceptionDestination, senderId);
        Member receiver = findMemberById(exceptionDestination, messageRequest.getReceiveId());
        Room room = findRoomById(exceptionDestination, messageRequest.getRoomId());

        if (room.getStatus() == OPEN) {
            room.setStatus(PROGRESS);
            RoomMember roomMember = findChatRoomMemberByChatRoomId(exceptionDestination, room.getId());
            roomRepository.save(room);
            roomMemberRepository.save(roomMember);
        }

        if (room.getStatus() == CLOSE) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_ROOM.message());
            throw new MessageException(INVALIDED_ROOM);
        }

        if (room.getStatus() == SET) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_ROOM.message());
            throw new MessageException(INVALIDED_ROOM);
        }

        if (room.getStatus() == DELETE) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, INVALIDED_ROOM.message());
            throw new MessageException(INVALIDED_ROOM);
        }

        Message message = Message.builder()
                .content(messageRequest.getContent())
                .sender(sender)
                .room(room)
                .sendTime(LocalDateTime.now())
                .isRead(false)
                .build();
        messageRepository.save(message);

        RoomMember roomMember = findChatRoomMember(room);

        MessageResponse messageResponse = new MessageResponse();

        if (roomMember.getSender().equals(sender)) {
            createMessageResponseForSender(senderId, sender, receiver, message, roomMember, messageResponse);
        }

        if (roomMember.getReceiver().equals(sender)) {
            createMessageResponseForReceiver(senderId, sender, receiver, message, roomMember, messageResponse);
        }

        redisTemplate.convertAndSend(channelTopic.getTopic(), messageResponse);
    }

    private void createMessageResponseForReceiver(
            Long senderId,
            Member sender,
            Member receiver,
            Message message,
            RoomMember roomMember,
            MessageResponse messageResponse
    ) {
        messageResponse.setMethod("receiveChat");
        messageResponse.setRoomId(message.getRoom().getId());
        messageResponse.setSenderId(senderId);
        messageResponse.setReceiveId(receiver.getId());
        messageResponse.setSenderNickname(sender.getBasicInfo().getNickname());
        messageResponse.setSenderFaceInfoS3Url(roomMember.getReceiver().getFaceInfo().getGeneratedS3url());
        messageResponse.setContent(message.getContent());
        messageResponse.setType("message");
        messageResponse.setCreatedAt(message.getSendTime());
        messageResponse.setIsRead(message.isRead());
    }

    private void createMessageResponseForSender(
            Long senderId,
            Member sender,
            Member receiver,
            Message message,
            RoomMember roomMember,
            MessageResponse messageResponse
    ) {
        messageResponse.setMethod("receiveChat");
        messageResponse.setRoomId(message.getRoom().getId());
        messageResponse.setSenderId(senderId);
        messageResponse.setReceiveId(receiver.getId());
        messageResponse.setSenderNickname(sender.getBasicInfo().getNickname());
        messageResponse.setSenderFaceInfoS3Url(roomMember.getSender().getFaceInfo().getGeneratedS3url());
        messageResponse.setContent(message.getContent());
        messageResponse.setType("message");
        messageResponse.setCreatedAt(message.getSendTime());
        messageResponse.setIsRead(message.isRead());
    }

    public List<MessageListResponse> getMessagePage(Long roomId, int pageNo, MessageListRequest messageListRequest) {
        Sort sort = Sort.by(Sort.Direction.DESC, "sendTime");
        Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE, sort);
        LocalDateTime time = messageListRequest.sendTime();
        List<Message> messagePage = messageRepository.findChatMessagesByChatRoom_IdAndSendTimeBefore(roomId,
                time, pageable);

        List<MessageListResponse> messageListResponses = new ArrayList<>();

        for (Message message : messagePage) {
            MessageListResponse messageListResponse = MessageListResponse.of(message);
            messageListResponses.add(messageListResponse);
        }

        return messageListResponses;
    }

    private Member findMemberById(String destination, Long memberId) {
        Member member = memberRepository.findById(memberId).orElse(null);

        if (member == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND.message());
            throw new MemberException(NOT_FOUND);
        }

        return member;
    }

    private Room findRoomById(String destination, Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);

        if (room == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_ROOM.message());
            throw new MessageException(NOT_FOUND_ROOM);
        }

        return room;
    }

    private RoomMember findChatRoomMember(Room room) {
        return roomMemberRepository.findByChatRoomId(room.getId())
                .orElseThrow(() -> new MessageException(NOT_FOUND_ROOM_MEMBER));
    }

    private RoomMember findChatRoomMemberByChatRoomId(String destination, Long roomId) {
        RoomMember roomMember = roomMemberRepository.findByChatRoomId(roomId).orElse(null);

        if (roomMember == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_ROOM_MEMBER.message());
            throw new MessageException(NOT_FOUND_ROOM_MEMBER);
        }

        return roomMember;
    }
}