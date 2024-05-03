package capstone.facefriend.resume.domain;

import capstone.facefriend.member.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Slf4j
@DynamicInsert
@DynamicUpdate
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESUME_ID")
    private Long id;

    @OneToOne
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member member; // 본인

    @ElementCollection
    @CollectionTable(name = "RESUME_IMAGE_S3_URLS", joinColumns = @JoinColumn(name = "RESUME_ID"))
    private List<String> resumeImageS3urls;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private String content;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "OPEN_MEMBER", joinColumns = @JoinColumn(name = "RESUME_ID"))
    @MapKeyColumn(name = "MEMBER_ID") // key
    @Column(name = "IS_OPEN") // value
    private Map<Long, Boolean> friends = new HashMap<>(); // 타멤버id : 공개여부

    public enum Category {
        SIMILAR_ANALYSIS("비슷한 관상"),
        DIFFERENT_ANALYSIS("다른 관상"),
        FOOD("음식"),
        WORKOUT("운동"),
        MOVIE("영화"),
        FASHION("패션"),
        DATING("연애"),
        MUSIC("음악"),
        STUDY("영화"),
        ETC("기타");

        private final String value;

        Category(String value) {
            this.value = value;
        }
    }
}
