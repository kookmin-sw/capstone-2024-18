package capstone.facefriend.resume.domain;

import capstone.facefriend.member.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.*;

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

    @Builder.Default
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "CATEGORIES", joinColumns = @JoinColumn(name = "RESUME_ID"))
    @Enumerated(EnumType.STRING)
    private Set<Category> categories = new HashSet<>();

    private String content;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "OPEN_MEMBER", joinColumns = @JoinColumn(name = "RESUME_ID"))
    @MapKeyColumn(name = "MEMBER_ID") // key
    @Column(name = "IS_OPEN") // value
    private Map<Long, Boolean> friends = new HashMap<>(); // 타멤버id : 공개여부

    public enum Category {
        FOOD("음식"),
        WORKOUT("운동"),
        MOVIE("영화"),
        FASHION("패션"),
        DATING("연애"),
        MUSIC("음악"),
        STUDY("공부"),
        ETC("기타");

        private final String value;

        Category(String value) {
            this.value = value;
        }
    }
}
