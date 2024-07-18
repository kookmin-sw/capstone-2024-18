package capstone.facefriend.message.service;

import static capstone.facefriend.message.domain.Room.Status;
import static capstone.facefriend.message.domain.Room.Status.CLOSE;
import static capstone.facefriend.message.domain.Room.Status.OPEN;
import static capstone.facefriend.message.domain.Room.Status.PROGRESS;
import static capstone.facefriend.message.domain.Room.Status.SET;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM_MEMBER;

import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.message.domain.Message;
import capstone.facefriend.message.domain.Room;
import capstone.facefriend.message.domain.RoomMember;
import capstone.facefriend.message.exception.MessageException;
import capstone.facefriend.message.repository.MessageRepository;
import capstone.facefriend.message.repository.RoomMemberRepository;
import capstone.facefriend.message.repository.RoomRepository;
import capstone.facefriend.message.service.dto.chatroom.RoomCloseResponse;
import capstone.facefriend.message.service.dto.chatroom.RoomEmptyResponse;
import capstone.facefriend.message.service.dto.chatroom.RoomHeartResponse;
import capstone.facefriend.message.service.dto.chatroom.RoomLeftResponse;
import capstone.facefriend.message.service.dto.chatroom.RoomMessageResponse;
import capstone.facefriend.message.service.dto.chatroom.RoomOpenResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final MessageRepository messageRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final String EMPTY_MESSAGE = "채팅을 시작하지 않았습니다.";
    private static final String OPEN_MESSAGE = "채팅을 시작해보세요!";
    private static final String CLOSE_MESSAGE = "상대방이 떠났습니다.";

    @Transactional
    public Map<String, Object> getChatRoomList(Long memberId) {

        List<RoomMember> roomMemberList = new ArrayList<>();
        roomMemberList.addAll(findAllChatRoomMemberByReceiverId(memberId));
        roomMemberList.addAll(findAllChatRoomMemberBySenderId(memberId));

        Map<String, Object> chatRooms = new HashMap<>();

        if (roomMemberList.isEmpty()) {
            RoomEmptyResponse roomEmptyResponse = RoomEmptyResponse.of(EMPTY_MESSAGE);
            chatRooms.put("chatRoomList", roomEmptyResponse);
            return chatRooms;
        }

        List<RoomMessageResponse> chatRoomsMessage = new ArrayList<>();
        List<RoomHeartResponse> chatRoomsHeart = new ArrayList<>();
        List<RoomOpenResponse> chatRoomsOpen = new ArrayList<>();
        List<RoomCloseResponse> chatRoomClose = new ArrayList<>();

        Member member = findMemberById(memberId);

        for (RoomMember roomMember : roomMemberList) {
            Status status = roomMember.getRoom().getStatus();

            if (status == SET) {
                createChatRoomHeartResponse(memberId, chatRoomsHeart, member, roomMember);
            }

            if (status == PROGRESS) {
                createChatRoomMessageResponse(memberId, chatRoomsMessage, member, roomMember);
            }

            if (status == OPEN) {
                createChatRoomOpenResponse(memberId, chatRoomsOpen, member, roomMember);
            }

            if (status == CLOSE) {
                createChatRoomCloseResponse(memberId, chatRoomClose, member, roomMember);
            }
        }

        chatRooms.put("chatRoomHeartList", chatRoomsHeart);
        chatRooms.put("chatRoomMessageList", chatRoomsMessage);
        chatRooms.put("chatRoomOpenList", chatRoomsOpen);
        chatRooms.put("chatRoomCloseList", chatRoomClose);

        return chatRooms;
    }

    private void createChatRoomCloseResponse(
            Long memberId,
            List<RoomCloseResponse> chatRoomClose,
            Member member,
            RoomMember roomMember
    ) {
        Member leftMember = identifyLeftMember(memberId, roomMember);
        Room room = roomMember.getRoom();

        if (member.equals(leftMember)) {
            RoomCloseResponse roomCloseResponse = RoomCloseResponse.of(member, room, CLOSE_MESSAGE);
            chatRoomClose.add(roomCloseResponse);
        }
    }

    private void createChatRoomOpenResponse(
            Long memberId,
            List<RoomOpenResponse> chatRoomsOpen,
            Member member,
            RoomMember roomMember
    ) {
        String memberFaceInfo;
        String senderFaceInfo;

        Member sender = identifySender(roomMember, memberId);
        Boolean isSender = isSender(roomMember, memberId);

        Room room = roomMember.getRoom();

        if (isSender == true) {
            memberFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
        } else {
            memberFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
        }

        RoomOpenResponse roomOpenResponse
                = RoomOpenResponse.of(member, sender, room, memberFaceInfo, senderFaceInfo, OPEN_MESSAGE);

        chatRoomsOpen.add(roomOpenResponse);
    }

    private void createChatRoomMessageResponse(
            Long memberId,
            List<RoomMessageResponse> chatRoomsMessage,
            Member member,
            RoomMember roomMember
    ) {
        String memberFaceInfo;
        String senderFaceInfo;

        Room room = roomMember.getRoom();
        Long roomId = room.getId();

        Member sender = identifySender(roomMember, memberId);
        Message message = messageRepository.findFirstByRoomIdOrderBySendTimeDesc(roomId);
        Boolean isSender = isSender(roomMember, memberId);

        if (isSender == true) {
            memberFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
        } else {
            memberFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
        }

        RoomMessageResponse chatRoomResponse
                = RoomMessageResponse.of(member, sender, room, memberFaceInfo, senderFaceInfo, message);

        chatRoomsMessage.add(chatRoomResponse);
    }

    private void createChatRoomHeartResponse(
            Long memberId,
            List<RoomHeartResponse> chatRoomsHeart,
            Member member,
            RoomMember roomMember
    ) {
        String memberFaceInfo;
        String senderFaceInfo;

        Member sender = identifySender(roomMember, memberId);
        Boolean isSender = isSender(roomMember, memberId);

        Room room = roomMember.getRoom();

        if (isSender == true) {
            memberFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
        } else {
            memberFaceInfo = roomMember.getReceiver().getFaceInfo().getGeneratedS3url();
            senderFaceInfo = roomMember.getSender().getFaceInfo().getGeneratedS3url();
        }

        RoomHeartResponse roomHeartResponse
                = RoomHeartResponse.of(member, sender, room, memberFaceInfo, senderFaceInfo, isSender);

        chatRoomsHeart.add(roomHeartResponse);
    }

    @Transactional
    public String leftRoom(Long roomId, Long memberId) {

        Room room = findRoomById(roomId);
        Status status = room.getStatus();
        RoomMember roomMember = findChatRoomMemberByChatRoomId(roomId);

        Member member = findMemberById(memberId);
        Member sender = identifySender(roomMember, memberId);
        Member leftMember = identifyLeftMember(memberId, roomMember);

        if (status == CLOSE) {
            if (!member.equals(leftMember)) {
                roomMemberRepository.delete(roomMember);
                roomRepository.delete(room);
                return "채팅방을 떠났습니다.";
            }
            return "이미 떠난 채팅방입니다.";
        }

        List<Message> messages = findChatRoomMessageByChatRoomId(roomId);

        if (!messages.isEmpty()) {
            messageRepository.deleteAll(messages);
        }

        if (roomMember.getSender().equals(member)) {
            roomMember.setSenderExist(false);
        } else if (roomMember.getReceiver().equals(member)) {
            roomMember.setReceiverExist(false);
        } else {
            return "속해있지 않은 채팅방입니다.";
        }

        room.setStatus(CLOSE);
        String content = "상대방이 떠났습니다.";
        String method = "receiveLeftRoom";
        LocalDateTime sendTime = LocalDateTime.now();
        RoomLeftResponse roomLeftResponse = RoomLeftResponse.of(method, roomId, leftMember, sendTime,
                content);

        simpMessagingTemplate.convertAndSend("/sub/chat/" + sender.getId(), roomLeftResponse);
        roomRepository.save(room);
        roomMemberRepository.save(roomMember);

        return "채팅방을 떠났습니다";
    }

    private Member identifySender(RoomMember roomMember, Long memberId) {
        Member member = findMemberById(memberId);
        if (member.getId().equals(roomMember.getSender().getId())) {
            return roomMember.getReceiver();
        }
        return roomMember.getSender();
    }

    private Member identifyLeftMember(Long memberId, RoomMember roomMember) {
        Member member = findMemberById(memberId);
        if (roomMember.getSender().equals(member) && roomMember.isSenderExist()) {
            return roomMember.getReceiver();
        }
        return roomMember.getSender();
    }

    private Boolean isSender(RoomMember roomMember, Long memberId) {
        Member member = findMemberById(memberId);
        if (member.getId().equals(roomMember.getSender().getId())) {
            return true;
        }
        return false;
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }

    private List<RoomMember> findAllChatRoomMemberBySenderId(Long memberId) {
        return roomMemberRepository.findAllBySenderId(memberId).orElse(new ArrayList<>());
    }

    private List<RoomMember> findAllChatRoomMemberByReceiverId(Long memberId) {
        return roomMemberRepository.findAllByReceiverId(memberId).orElse(new ArrayList<>());
    }

    private Room findRoomById(Long roomId) {
        return roomRepository.findById(roomId).orElseThrow(() -> new MessageException(NOT_FOUND_ROOM));
    }

    private RoomMember findChatRoomMemberByChatRoomId(Long roomId) {
        return roomMemberRepository.findByRoomId(roomId)
                .orElseThrow(() -> new MessageException(NOT_FOUND_ROOM_MEMBER));
    }

    private List<Message> findChatRoomMessageByChatRoomId(Long roomId) {
        return messageRepository.findMessagesByRoomId(roomId);
    }
}