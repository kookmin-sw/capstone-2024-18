package capstone.facefriend.member.domain.member;

import capstone.facefriend.common.domain.BaseEntity;
import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfoByLevel;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.HashMap;
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
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToOne
    @JoinColumn(name = "BASIC_INFO_ID", nullable = false)
    private BasicInfo basicInfo;

    @OneToOne
    @JoinColumn(name = "FACE_INFO_ID", nullable = false)
    private FaceInfo faceInfo;

    @OneToOne
    @JoinColumn(name = "ANALYSIS_INFO_ID", nullable = false)
    private AnalysisInfo analysisInfo;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "MEMBER_IS_PUBLIC_MAP", joinColumns = @JoinColumn(name = "MEMBER_ID"))
    @MapKeyColumn(name = "MEM_ID") // key = other member
    @Column(name = "FAMILIARITY") // value = open or close
    private Map<Long, Integer> friends = new HashMap<>();

    public Member(String email) {
        this.email = email;
        this.role = Role.USER;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isSame(Long id) {
        return this.id.equals(id);
    }
}