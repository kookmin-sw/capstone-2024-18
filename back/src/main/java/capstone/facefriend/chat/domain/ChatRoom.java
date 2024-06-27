package capstone.facefriend.chat.domain;

import capstone.facefriend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;

@Getter
@Setter
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Slf4j
@DynamicInsert
public class ChatRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column
    private Status status = Status.SET;

    @Column
    private boolean isPublic;

    public enum Status {
        SET("SET"),
        OPEN("OPEN"),
        PROGRESS("PROGRESS"),
        CLOSE("CLOSE"),
        DELETE("DELETE");

        private final String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}