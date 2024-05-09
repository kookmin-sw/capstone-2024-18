package capstone.facefriend.chat.domain;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@RedisHash("ChatRoom")
@Slf4j
public class ChatRoomInfo {
    @Id
    private String chatRoomInfoId;

    @Column(name = "enterTime", nullable = false)
    private LocalDateTime enterTime;

}
