package capstone.facefriend.chat.domain;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
public class ChatRoomInfoId implements Serializable {
    @Column(name = "roomId")
    private Long roomId;

    @Column(name = "memberId")
    private Long memberId;
}
