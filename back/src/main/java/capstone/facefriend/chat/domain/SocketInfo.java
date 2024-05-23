package capstone.facefriend.chat.domain;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@RedisHash("SocketInfo")
public class SocketInfo {
    @Id
    private Long memberId;

    @Column(name = "connectTime", nullable = false)
    private LocalDateTime connectTime;
}