package capstone.facefriend.chat.domain;

import capstone.facefriend.common.domain.BaseEntity;
import capstone.facefriend.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;

@Getter
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Slf4j
@DynamicInsert
public class RoomMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Room_ID")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "SENDER_ID")
    private Member sender;

    @ManyToOne
    @JoinColumn(name = "RECEIVER_ID")
    private Member receiver;

    @Column
    private boolean isSenderExist;

    @Column
    private boolean isReceiverExist;

    @Column
    private boolean isSenderPublic;

    @Column
    private boolean isReceiverPublic;

    public void setRoom(Room room) {
        this.room = room;
    }
    public void setSender(Member Sender) {
        this.sender = sender;
    }
    public void setReceiver(Member Sender) {
        this.receiver = receiver;
    }

    public boolean isSenderExist() {return this.isSenderExist == true;}
    public boolean isReceiverExist() {return this.isReceiverExist == true;}
    public boolean isSenderPublic() {return this.isSenderPublic == true;}
    public boolean isReceiverPublic() {return this.isReceiverPublic == true;}


}
