package capstone.facefriend.message.service;

import static capstone.facefriend.message.domain.Room.Status.OPEN;
import static capstone.facefriend.message.domain.Room.Status.SET;
import static capstone.facefriend.message.exception.MessageExceptionType.ALREADY_ROOM;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM_MEMBER;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;

import capstone.facefriend.message.domain.Room;
import capstone.facefriend.message.domain.RoomMember;
import capstone.facefriend.message.exception.MessageException;
import capstone.facefriend.message.repository.RoomMemberRepository;
import capstone.facefriend.message.repository.RoomRepository;
import capstone.facefriend.message.service.dto.heart.HeartReplyRequest;
import capstone.facefriend.message.service.dto.heart.HeartReplyResponse;
import capstone.facefriend.message.service.dto.heart.HeartResponse;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.repository.MemberRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HeartService {

    private final RoomMemberRepository RoomMemberRepository;
    private final MemberRepository memberRepository;
    private final RoomRepository roomRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Transactional
    public void sendHeart(Long senderId, Long receiveId) {

        String exceptionDestination = "/sub/chat/" + senderId;

        if (RoomMemberRepository.findBySenderAndReceiver(senderId, receiveId).isPresent()) {
            simpMessagingTemplate.convertAndSend(exceptionDestination, ALREADY_ROOM.message());
            throw new MessageException(ALREADY_ROOM);
        }

        Room room = Room.builder()
                .status(SET)
                .isPublic(false)
                .build();
        roomRepository.save(room);

        Member sender = findMemberById(exceptionDestination, senderId);
        Member receiver = findMemberById(exceptionDestination, receiveId);

        RoomMember roomMember = RoomMember.builder()
                .room(room)
                .sender(sender)
                .receiver(receiver)
                .isSenderExist(true)
                .isReceiverExist(true)
                .isSenderPublic(false)
                .isReceiverPublic(false)
                .build();

        RoomMemberRepository.save(roomMember);

        HeartResponse heartResponse = new HeartResponse();
        heartResponse.setMethod("receiveHeart");
        heartResponse.setMemberId(receiveId);
        heartResponse.setSenderName(sender.getBasicInfo().getNickname());
        heartResponse.setSenderId(sender.getId());
        heartResponse.setType("Heart");
        heartResponse.setSenderOriginS3url(sender.getFaceInfo().getOriginS3url());
        heartResponse.setSenderGeneratedS3url(sender.getFaceInfo().getGeneratedS3url());
        heartResponse.setRoom(room);
        heartResponse.setCreatedAt(LocalDateTime.now());
        heartResponse.setSender(false);

        String topic = channelTopic.getTopic();
        simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 요청 성공");
        redisTemplate.convertAndSend(topic, heartResponse);
    }

    @Transactional
    public void heartReply(HeartReplyRequest heartReplyRequest, Long receiveId) {
        String exceptionDestination = "/sub/chat/" + receiveId;

        Member receiver = findMemberById(exceptionDestination, receiveId);
        Member sender = findMemberById(exceptionDestination, heartReplyRequest.senderId());

        RoomMember roomMember = findSenderReceiver(exceptionDestination, sender.getId(), receiver.getId());
        Room room = findRoomById(exceptionDestination, roomMember.getRoom().getId());

        // 대화 수락
        if (heartReplyRequest.intention().equals("positive")) {
            room.setStatus(OPEN);
            roomRepository.save(room);
            RoomMemberRepository.save(roomMember);
            simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 수락");
        }

        // 대화 거절
        else if (heartReplyRequest.intention().equals("negative")) {
            RoomMemberRepository.delete(roomMember);
            roomRepository.delete(room);
            simpMessagingTemplate.convertAndSend(exceptionDestination, "대화 거절");
        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, ALREADY_ROOM);
            throw new MessageException(ALREADY_ROOM);
        }

        String destination = "/sub/chat/" + sender.getId();
        String method = "receiveHeartResponse";
        HeartReplyResponse heartReplyResponse = HeartReplyResponse.of(receiveId, heartReplyRequest, method);

        simpMessagingTemplate.convertAndSend(destination, heartReplyResponse);
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

    private RoomMember findSenderReceiver(String destination, Long senderId, Long receiveId) {
        RoomMember roomMember = RoomMemberRepository.findBySenderAndReceiver(senderId, receiveId)
                .orElse(null);

        if (roomMember == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_ROOM_MEMBER.message());
            throw new MessageException(NOT_FOUND_ROOM_MEMBER);
        }

        return roomMember;
    }
}
