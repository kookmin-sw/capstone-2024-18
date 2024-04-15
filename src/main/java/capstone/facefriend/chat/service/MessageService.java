package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.infrastructure.repository.MessageRepository;
import capstone.facefriend.chat.infrastructure.repository.RoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageRequest;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MemberRepository memberRepository;
    private final RoomRepository roomRepository;
    private final RedisTemplate redisTemplate;
    private final String topic = String.valueOf(ChannelTopic.of("chatroom"));
    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }

    private Room findRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()-> new RuntimeException("not found"));
        return room;
    }

    @Transactional
    public void sendMessage(MessageRequest messageRequest) {

    }

}