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
public class RoomMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ROOM_ID")
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

    public boolean isSenderExist() {
        return this.isSenderExist == true;
    }

    public boolean isReceiverExist() {
        return this.isReceiverExist == true;
    }
}