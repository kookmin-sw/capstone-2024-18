package capstone.facefriend.message.domain;

import jakarta.persistence.Column;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@RedisHash("SocketInfo")
public class SocketInfo {

    @Id
    private Long memberId;

    @Column(name = "connectTime", nullable = false)
    private LocalDateTime connectTime;
}