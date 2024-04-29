//package capstone.facefriend.member.domain;
//
//import jakarta.persistence.*;
//import lombok.*;
//import lombok.extern.slf4j.Slf4j;
//
//@Entity
//@Builder
//@EqualsAndHashCode(of = "id", callSuper = false)
//@AllArgsConstructor(access = AccessLevel.PRIVATE)
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@Slf4j
//public class ResumeImage {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "RESUME_IMAGE_ID")
//    private Long id;
//
//    private String imageUrl;
//
//    @ManyToOne
//    @JoinColumn(name = "RESUME_ID", insertable = false, updatable = false)
//    private Resume resume;
//}
