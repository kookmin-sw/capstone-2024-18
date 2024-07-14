package capstone.facefriend.message.domain;

import capstone.facefriend.common.domain.BaseEntity;
import capstone.facefriend.member.domain.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Message extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime sendTime;

    @Column
    private boolean isRead;

    @ManyToOne
    @JoinColumn(name = "SENDER_ID")
    private Member sender;

    @ManyToOne
    @JoinColumn(name = "ROOM_ID")
    private Room room;

    public void setMember(Member sender) {
        this.sender = sender;
    }

    public void setRoom(Room Room) {
        this.room = Room;
    }
}