//package capstone.facefriend.chat.service;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.messaging.simp.SimpMessageSendingOperations;
//import org.springframework.stereotype.Service;
//
//@Slf4j
//@Service
//public class RedisMessageService {
//
//    private final RedisTemplate<String, Object> redisTemplate;
//    private final SimpMessageSendingOperations messagingTemplate;
//
//    public RedisMessageService(RedisTemplate<String, Object> redisTemplate, SimpMessageSendingOperations messagingTemplate) {
//        this.redisTemplate = redisTemplate;
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    public boolean isUserConnected(String roomId, String sessionId) {
//        String key = "room:" + roomId + ":connectedUsers";
//        Boolean isConnected = redisTemplate.opsForSet().isMember(key, sessionId);
//        return isConnected != null && isConnected;
//    }
//    public void saveMessage(String roomId, Object message) {
//        String key = "messages:" + roomId;
//        redisTemplate.opsForList().leftPush(key, message);
//    }
//
//}
