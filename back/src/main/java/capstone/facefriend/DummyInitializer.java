package capstone.facefriend;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.Role;
import capstone.facefriend.member.repository.AnalysisInfoRepository;
import capstone.facefriend.member.repository.BasicInfoRepository;
import capstone.facefriend.member.repository.FaceInfoRepository;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.service.MemberService;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.repository.ResumeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class DummyInitializer {

    private final MemberRepository memberRepository;
    private final BasicInfoRepository basicInfoRepository;
    private final FaceInfoRepository faceInfoRepository;
    private final AnalysisInfoRepository analysisInfoRepository;
    private final ResumeRepository resumeRepository;

    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        for (int i = 1; i <= 100; i++) {
            BasicInfo basicInfo = BasicInfo.builder()
                    .nickname("nickname_" + i)
                    .gender(BasicInfo.Gender.DEFAULT)
                    .region(BasicInfo.Region.DEFAULT)
                    .ageGroup(BasicInfo.AgeGroup.DEFAULT)
                    .ageDegree(BasicInfo.AgeDegree.DEFAULT)
                    .heightGroup(BasicInfo.HeightGroup.DEFAULT)
                    .build();
            basicInfoRepository.save(basicInfo);

            FaceInfo faceInfo = FaceInfo.builder()
                    .originS3url("")
                    .generatedS3url("")
                    .build();
            faceInfoRepository.save(faceInfo);

            AnalysisInfo analysisInfo = AnalysisInfo.builder()
                    .analysisFull(Map.of("", ""))
                    .analysisShort(List.of(""))
                    .faceShapeIdNum(i % 5)
                    .build();
            analysisInfoRepository.save(analysisInfo);

            Member member = Member.builder()
                    .email(i + "@" + i + ".com")
                    .password(passwordEncoder.encode("123"))
                    .role(Role.USER)
                    .basicInfo(basicInfo)
                    .faceInfo(faceInfo)
                    .analysisInfo(analysisInfo)
                    .build();
            memberRepository.save(member);

            Resume resume = Resume.builder()
                    .member(member)
                    .categories(i % 5 == 0 ? Set.of(Resume.Category.MOVIE) : Set.of(Resume.Category.DATING))
                    .build();
            resumeRepository.save(resume);
        }
    }
}
