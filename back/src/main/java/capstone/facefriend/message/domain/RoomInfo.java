package capstone.facefriend.message.domain;

import jakarta.persistence.Column;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@NoArgsConstructor
@RedisHash("roomInfo")
public class RoomInfo {

    @Id
    private String id;

    @Column(name = "enterTime", nullable = false)
    private LocalDateTime enterTime;
}