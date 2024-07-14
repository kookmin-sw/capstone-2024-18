package capstone.facefriend.message.service;

import static capstone.facefriend.message.exception.MessageExceptionType.FAIL_TO_SOCKET_INFO;
import static capstone.facefriend.message.exception.MessageExceptionType.NOT_FOUND_ROOM;

import capstone.facefriend.message.domain.Room;
import capstone.facefriend.message.domain.SocketInfo;
import capstone.facefriend.message.exception.MessageException;
import capstone.facefriend.message.repository.RoomRepository;
import capstone.facefriend.message.repository.SocketInfoRedisRepository;
import capstone.facefriend.message.service.dto.heart.HeartResponse;
import capstone.facefriend.message.service.dto.message.MessageResponse;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BackgroundService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;
    private final SocketInfoRedisRepository socketInfoRedisRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RoomRepository roomRepository;

    @Transactional
    public void enterApplication(Long memberId) {
        String exceptionDestination = "/sub/chat/" + memberId;

        SocketInfo socketInfo = new SocketInfo();
        socketInfo.setMemberId(memberId);
        socketInfo.setConnectTime(LocalDateTime.now());
        socketInfoRedisRepository.save(socketInfo);

        if (isExistUnReadMessage(memberId)) {
            sendSentMessage(memberId);
        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, "큐잉된 메시지가 없습니다.");
        }

        if (isExistUnSendHeart(memberId)) {
            sendSentHeart(exceptionDestination, memberId);
        } else {
            simpMessagingTemplate.convertAndSend(exceptionDestination, "큐잉된 대화요청이 없습니다.");
        }

        simpMessagingTemplate.convertAndSend(exceptionDestination, "저장 성공");
    }

    @Transactional
    public String exitApplication(Long memberId) {
        SocketInfo socketInfo = findSocketInfo(memberId);
        socketInfoRedisRepository.delete(socketInfo);
        return "성공";
    }

    private Boolean isExistUnReadMessage(Long memberId) {
        return !redisTemplate.hasKey("/sub/chat/" + memberId + "message");
    }

    private Boolean isExistUnSendHeart(Long memberId) {
        return !redisTemplate.hasKey("/sub/chat/" + memberId + "SendHeart");
    }

    private void sendSentMessage(Long receiveId) {
        String topic = channelTopic.getTopic();
        String destination = "/sub/chat" + receiveId + "message";
        List<Object> messages = redisTemplate.opsForList().range(destination, 0, -1);
        Long messagesListSize = (messages != null) ? (long) messages.size() : 0;

        if (messagesListSize > 0) {
            for (Object messageObj : messages) {
                LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) messageObj;
                MessageResponse messageResponse = new MessageResponse(map);
                redisTemplate.convertAndSend(topic, messageResponse);
            }
            redisTemplate.delete(destination);
        }
    }

    private void sendSentHeart(String exceptionDestination, Long receiveId) {
        String topic = channelTopic.getTopic();
        String destination = "/sub/chat" + receiveId + "heart";
        List<Object> sendHearts = redisTemplate.opsForList().range(destination, 0, -1);
        Long messagesListSize = (sendHearts != null) ? (long) sendHearts.size() : 0;

        if (messagesListSize > 0) {
            for (Object sendHeartObj : sendHearts) {
                LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) sendHeartObj;
                LinkedHashMap<String, Object> chatRoomMap = (LinkedHashMap<String, Object>) map.get("chatRoom");
                Long roomId = ((Number) chatRoomMap.get("id")).longValue();
                Room room = findRoomById(exceptionDestination, roomId);
                HeartResponse heartResponse = new HeartResponse(map, room);
                redisTemplate.convertAndSend(topic, heartResponse);
            }
            redisTemplate.delete(destination);
        }
    }

    private SocketInfo findSocketInfo(Long memberId) {
        return socketInfoRedisRepository.findById(memberId).orElseThrow(() -> new MessageException(FAIL_TO_SOCKET_INFO));
    }

    private Room findRoomById(String destination, Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);

        if (room == null) {
            simpMessagingTemplate.convertAndSend(destination, NOT_FOUND_ROOM.message());
            throw new MessageException(NOT_FOUND_ROOM);
        }

        return room;
    }
}
