package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.infrastructure.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.infrastructure.repository.ChatRoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.ChatRoomRequest;
import capstone.facefriend.chat.infrastructure.repository.dto.ChatRoomResponse;
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
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;


    private ChatRoom findRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(()-> new RuntimeException("not found"));
        return chatRoom;
    }

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
        return member;
    }

    private ChatRoomMember findRoomMemberByRoom(ChatRoom chatRoom) {
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findByChatRoom(chatRoom)
                .orElseThrow(()-> new RuntimeException("not found"));
        return chatRoomMember;
    }
    @Transactional
    public ChatRoomResponse setRoom(Long senderId, Long receiveId) {
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

        return ChatRoomResponse.of(chatRoomMember);
    }

    public ChatRoomResponse putRoom(ChatRoomRequest request) {
        ChatRoom chatRoom = ChatRoom.builder()
                .status(ChatRoom.Status.open)
                .isPublic(false)
                .build();
        chatRoomRepository.save(chatRoom);
        ChatRoomMember chatRoomMember = findRoomMemberByRoom(chatRoom);
        chatRoomMember.setChatRoom(chatRoom);
        chatRoomRepository.save(chatRoom);

        return ChatRoomResponse.of(chatRoomMember);
    }
}
