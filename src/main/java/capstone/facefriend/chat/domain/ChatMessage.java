package capstone.facefriend.chat.domain;

import capstone.facefriend.common.domain.BaseEntity;
import capstone.facefriend.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Getter
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Slf4j
@DynamicInsert
public class ChatMessage extends BaseEntity {

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
    private ChatRoom chatRoom;

    public void setMember(Member sender) {
        this.sender = sender;
    }

    public void setChatRoom(ChatRoom ChatRoom) {
        this.chatRoom = ChatRoom;
    }
}
