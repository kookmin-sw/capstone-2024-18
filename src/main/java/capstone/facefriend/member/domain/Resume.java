//package capstone.facefriend.member.domain;
//
//import capstone.facefriend.common.domain.BaseEntity;
//import jakarta.persistence.*;
//import lombok.*;
//import lombok.extern.slf4j.Slf4j;
//import org.hibernate.annotations.DynamicUpdate;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Getter
//@Builder
//@EqualsAndHashCode(of = "id", callSuper = false)
//@AllArgsConstructor(access = AccessLevel.PRIVATE)
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@Entity
//@Slf4j
//@DynamicUpdate
//public class Resume extends BaseEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "RESUME_ID")
//    private Long id;
//
//    @OneToOne
//    @JoinColumn(name = "MEMBER_ID", nullable = false)
//    private Member member;
//
//    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
//    @JoinColumn(name = "RESUME_ID")
//    @Column(nullable = false)
//    private List<ResumeImage> resumeImages = new ArrayList<>();
//
//    @Column(nullable = false)
//    private String content;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Category category;
//
//    public void setResumeImages(List<ResumeImage> resumeImages) {
//        this.resumeImages = resumeImages;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public void setCategory(String category) {
//        this.category = Category.valueOf(category);
//    }
//
//    public enum Category {
//
//        DEFAULT(""),
//        EXERCISE("운동"),
//        FOOD("음식"),
//        MOVIE("영화"),
//        FASHION("패션"),
//        STUDY("공부"),
//        DATE("연애"),
//        MUSIC(""),
//        FREE("자유");
//
//        private final String value;
//
//        Category(String value) {
//            this.value = value;
//        }
//
//        public String getValue() {
//            return value;
//        }
//    }
//}
