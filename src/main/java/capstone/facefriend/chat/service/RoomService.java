package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.domain.RoomMember;
import capstone.facefriend.chat.infrastructure.repository.RoomMemberRepository;
import capstone.facefriend.chat.infrastructure.repository.RoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.RoomRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.RoomResponse;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.facefriend.member.exception.MemberExceptionType;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final MemberRepository memberRepository;
    private final RoomMemberRepository roomMemberRepository;


    private Room findRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()-> new RuntimeException("not found"));
        return room;
    }

    private Room findRoomByName(String name) {
        Room room = roomRepository.findByName(name)
                .orElseThrow(()-> new RuntimeException("not found"));
        return room;
    }

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
        return member;
    }

    private RoomMember findRoomMemberByRoom(Room room) {
        RoomMember roomMember = roomMemberRepository.findByRoom(room)
                .orElseThrow(()-> new RuntimeException("not found"));
        return roomMember;
    }
    @Transactional
    public RoomResponse setRoom(RoomRequest request, Long senderId, Long receiveId) {
        Room room = Room.builder()
                        .name(request.name())
                        .status(Room.Status.set)
                        .isPublic(false)
                        .build();
        roomRepository.save(room);

        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(receiveId);
        RoomMember roomMember = RoomMember.builder()
                .room(room)
                .sender(sender)
                .receiver(receiver)
                .isSenderExist(false)
                .isReceiverExist(false)
                .isSenderPublic(false)
                .isReceiverPublic(false)
                .build();
        roomMemberRepository.save(roomMember);

        return RoomResponse.of(roomMember);
    }

    public RoomResponse putRoom(RoomRequest request) {
        Room room = Room.builder()
                .name(request.name())
                .status(Room.Status.open)
                .isPublic(false)
                .build();
        roomRepository.save(room);
        RoomMember roomMember = findRoomMemberByRoom(room);
        roomMember.setRoom(room);
        roomRepository.save(room);

        return RoomResponse.of(roomMember);
    }
}
