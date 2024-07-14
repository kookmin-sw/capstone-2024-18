package capstone.facefriend.resume.domain;

import capstone.facefriend.member.domain.member.Member;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESUME_ID")
    private Long id;

    @OneToOne
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member member;

    @ElementCollection
    @CollectionTable(name = "RESUME_IMAGE_S3_URLS", joinColumns = @JoinColumn(name = "RESUME_ID"))
    private List<String> resumeImageS3urls;

    @Builder.Default
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "CATEGORIES", joinColumns = @JoinColumn(name = "RESUME_ID"))
    @Enumerated(EnumType.STRING)
    private Set<Category> categories = new HashSet<>();

    private String content;

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
