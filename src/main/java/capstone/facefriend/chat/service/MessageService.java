package capstone.facefriend.chat.service;

import capstone.facefriend.chat.domain.Message;
import capstone.facefriend.chat.domain.Room;
import capstone.facefriend.chat.infrastructure.repository.RoomRepository;
import capstone.facefriend.chat.infrastructure.repository.dto.MessageDto;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    private final MemberRepository memberRepository;
    private final RoomRepository roomRepository;

    private static final String MESSAGE_CACHE_KEY = "messageCacheRoom:";

    @Resource(name = "MessageRedisTemplate")
    private final RedisTemplate<String, Message> redisTemplate;


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

    public void CachedMessage(MessageDto dto, Long roomId) {
        Member member = findMemberById(dto.SENDER_ID());
        Room Room = findRoomById(roomId);

        Message message = Message.builder()
                .content(dto.content())
                .sender(member)
                .Room(Room)
                .sendTime(LocalDateTime.now())
                .build();

        String cacheKey = MESSAGE_CACHE_KEY+roomId;

        redisTemplate.opsForList().rightPush(cacheKey, message);
    }
}
