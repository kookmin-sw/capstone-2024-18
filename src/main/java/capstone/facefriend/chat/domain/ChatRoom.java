package capstone.facefriend.chat.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long masterId;

    private Long inviterId;

    @Builder
    public ChatRoom(Long id, Long masterId, Long inviterId) {
        this.id = id;
        this.masterId = masterId;
        this.inviterId = inviterId;
    }
}
