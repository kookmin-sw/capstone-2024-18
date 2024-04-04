package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.domain.RoomMember;
import capstone.facefriend.chat.infrastructure.repository.RoomMemberRepository;
import capstone.facefriend.chat.infrastructure.repository.RoomRepository;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.chat.domain.Room.builder;
import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

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

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }
    @Transactional
    public Room setRoom(String name) {
        Room room = builder()
                        .name(name)
                        .status(Room.Status.open)
                        .isPublic(false)
                        .build();
        roomRepository.save(room);
    return room;
    }

    @Transactional
    public RoomMember setRoomMember(Long roomId, Long senderId, Long receiverId) {
        Room room = findRoomById(roomId);
        Member sender = findMemberById(senderId);
        Member receiver = findMemberById(receiverId);

        RoomMember roomMember = RoomMember
                .builder()
                .room(room)
                .sender(sender)
                .receiver(receiver)
                .isSenderExist(true)
                .isReceiverExist(true)
                .isSenderPublic(false)
                .isReceiverPublic(false)
                .build();
        roomMemberRepository.save(roomMember);
        return roomMember;
    }

}
