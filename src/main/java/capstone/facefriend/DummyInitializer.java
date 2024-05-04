package capstone.facefriend;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.analysisInfo.AnalysisInfoRepository;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.service.AnalysisInfoService;
import capstone.facefriend.member.service.MemberService;
import capstone.facefriend.member.service.dto.member.SignUpRequest;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.domain.ResumeRepository;
import capstone.facefriend.resume.service.ResumeService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Slf4j
@RequiredArgsConstructor
public class DummyInitializer {

    private final MemberService memberService;
    private final MemberRepository memberRepository;

    private final AnalysisInfoRepository analysisInfoRepository;
    private final AnalysisInfoService analysisInfoService;

    private final ResumeService resumeService;
    private final ResumeRepository resumeRepository;


    @PostConstruct
    @Transactional
    public void init() {
        Random random = new Random();

        List<Integer> GOOD_COMBI = new ArrayList<>();

        List<String> CATEGORY = List.of("FOOD", "WORKOUT", "MOVIE", "FASHION", "DATING", "STUDY", "ETC");
        int size = CATEGORY.size();

        for (int i = 1; i <= 50; i++) {
            // 회원 가입
            memberService.signUp(new SignUpRequest(i + "@" + i + ".com", "123", "123"));
            Member member = memberRepository.findByEmail(i + "@" + i + ".com").get();

            // 관상 분석
            AnalysisInfo analysisInfo = member.getAnalysisInfo();
            analysisInfo.setFaceShapeIdNum(random.nextInt(5)); // 얼굴형 넘버 랜덤
            analysisInfoRepository.save(analysisInfo);

            // 자기소개서
            Resume resume = Resume.builder()
                    .category(Resume.Category.valueOf(CATEGORY.get(random.nextInt(size-1)))) // 카테고리 랜덤
                    .member(member)
                    .build();
            resumeRepository.save(resume);
        }
    }
}
