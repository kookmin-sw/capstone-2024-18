package capstone.facefriend;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.repository.AnalysisInfoRepository;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.service.MemberService;
import capstone.facefriend.member.dto.member.SignUpRequest;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.repository.ResumeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class DummyInitializer {

    private final MemberService memberService;
    private final MemberRepository memberRepository;

    private final AnalysisInfoRepository analysisInfoRepository;
    private final ResumeRepository resumeRepository;

    @PostConstruct
    @Transactional
    public void init() {
        Random random = new Random();

        List<List<String>> CATEGORY = List.of(
                List.of("FOOD"),
                List.of("WORKOUT"),
                List.of("MOVIE"),
                List.of("FASHION"),
                List.of("DATING"),
                List.of("STUDY"),
                List.of("ETC"),
                List.of("FOOD", "WORKOUT"),
                List.of("FOOD", "MOVIE"),
                List.of("FOOD", "FASHION"),
                List.of("FOOD", "DATING"),
                List.of("FOOD", "STUDY"),
                List.of("FOOD", "ETC"),
                List.of("WORKOUT", "MOVIE"),
                List.of("WORKOUT", "FASHION"),
                List.of("WORKOUT", "DATING"),
                List.of("WORKOUT", "STUDY"),
                List.of("WORKOUT", "ETC"),
                List.of("MOVIE", "FASHION"),
                List.of("MOVIE", "DATING"),
                List.of("MOVIE", "STUDY"),
                List.of("MOVIE", "ETC"),
                List.of("FASHION", "DATING"),
                List.of("FASHION", "STUDY"),
                List.of("FASHION", "ETC"),
                List.of("DATING", "STUDY"),
                List.of("DATING", "ETC"),
                List.of("STUDY", "ETC"),
                List.of("FOOD", "WORKOUT", "MOVIE"),
                List.of("FOOD", "WORKOUT", "FASHION"),
                List.of("FOOD", "WORKOUT", "DATING"),
                List.of("FOOD", "WORKOUT", "STUDY"),
                List.of("FOOD", "WORKOUT", "ETC"),
                List.of("FOOD", "MOVIE", "FASHION"),
                List.of("FOOD", "MOVIE", "DATING"),
                List.of("FOOD", "MOVIE", "STUDY"),
                List.of("FOOD", "MOVIE", "ETC"),
                List.of("FOOD", "FASHION", "DATING"),
                List.of("FOOD", "FASHION", "STUDY"),
                List.of("FOOD", "FASHION", "ETC"),
                List.of("FOOD", "DATING", "STUDY"),
                List.of("FOOD", "DATING", "ETC"),
                List.of("FOOD", "STUDY", "ETC"),
                List.of("WORKOUT", "MOVIE", "FASHION"),
                List.of("WORKOUT", "MOVIE", "DATING"),
                List.of("WORKOUT", "MOVIE", "STUDY"),
                List.of("WORKOUT", "MOVIE", "ETC"),
                List.of("WORKOUT", "FASHION", "DATING"),
                List.of("WORKOUT", "FASHION", "STUDY"),
                List.of("WORKOUT", "FASHION", "ETC"),
                List.of("WORKOUT", "DATING", "STUDY"),
                List.of("WORKOUT", "DATING", "ETC"),
                List.of("WORKOUT", "STUDY", "ETC"),
                List.of("MOVIE", "FASHION", "DATING"),
                List.of("MOVIE", "FASHION", "STUDY"),
                List.of("MOVIE", "FASHION", "ETC"),
                List.of("MOVIE", "DATING", "STUDY"),
                List.of("MOVIE", "DATING", "ETC"),
                List.of("MOVIE", "STUDY", "ETC"),
                List.of("FASHION", "DATING", "STUDY"),
                List.of("FASHION", "DATING", "ETC"),
                List.of("FASHION", "STUDY", "ETC"),
                List.of("DATING", "STUDY", "ETC"),
                List.of("FOOD", "WORKOUT", "MOVIE", "FASHION"),
                List.of("FOOD", "WORKOUT", "MOVIE", "DATING"),
                List.of("FOOD", "WORKOUT", "MOVIE", "STUDY"),
                List.of("FOOD", "WORKOUT", "MOVIE", "ETC"),
                List.of("FOOD", "WORKOUT", "FASHION", "DATING"),
                List.of("FOOD", "WORKOUT", "FASHION", "STUDY"),
                List.of("FOOD", "WORKOUT", "FASHION", "ETC"),
                List.of("FOOD", "WORKOUT", "DATING", "STUDY"),
                List.of("FOOD", "WORKOUT", "DATING", "ETC"),
                List.of("FOOD", "WORKOUT", "STUDY", "ETC"),
                List.of("FOOD", "MOVIE", "FASHION", "DATING"),
                List.of("FOOD", "MOVIE", "FASHION", "STUDY"),
                List.of("FOOD", "MOVIE", "FASHION", "ETC"),
                List.of("FOOD", "MOVIE", "DATING", "STUDY"),
                List.of("FOOD", "MOVIE", "DATING", "ETC"),
                List.of("FOOD", "MOVIE", "STUDY", "ETC"),
                List.of("FOOD", "FASHION", "DATING", "STUDY"),
                List.of("FOOD", "FASHION", "DATING", "ETC"),
                List.of("FOOD", "FASHION", "STUDY", "ETC"),
                List.of("FOOD", "DATING", "STUDY", "ETC"),
                List.of("WORKOUT", "MOVIE", "FASHION", "DATING"),
                List.of("WORKOUT", "MOVIE", "FASHION", "STUDY"),
                List.of("WORKOUT", "MOVIE", "FASHION", "ETC"),
                List.of("WORKOUT", "MOVIE", "DATING", "STUDY"),
                List.of("WORKOUT", "MOVIE", "DATING", "ETC"),
                List.of("WORKOUT", "MOVIE", "STUDY", "ETC"),
                List.of("WORKOUT", "FASHION", "DATING", "STUDY"),
                List.of("WORKOUT", "FASHION", "DATING", "ETC"),
                List.of("WORKOUT", "FASHION", "STUDY", "ETC"),
                List.of("WORKOUT", "DATING", "STUDY", "ETC"),
                List.of("MOVIE", "FASHION", "DATING", "STUDY"),
                List.of("MOVIE", "FASHION", "DATING", "ETC"),
                List.of("MOVIE", "FASHION", "STUDY", "ETC"),
                List.of("MOVIE", "DATING", "STUDY", "ETC"),
                List.of("FASHION", "DATING", "STUDY", "ETC"),
                List.of("FOOD", "WORKOUT", "MOVIE", "FASHION", "DATING"),
                List.of("FOOD", "WORKOUT", "MOVIE", "FASHION", "STUDY"),
                List.of("FOOD", "WORKOUT", "MOVIE", "FASHION", "ETC"),
                List.of("FOOD", "WORKOUT", "MOVIE", "DATING", "STUDY"),
                List.of("FOOD", "WORKOUT", "MOVIE", "DATING", "ETC"),
                List.of("FOOD", "WORKOUT", "MOVIE", "STUDY", "ETC"),
                List.of("FOOD", "WORKOUT", "FASHION", "DATING", "STUDY"),
                List.of("FOOD", "WORKOUT", "FASHION", "DATING", "ETC"),
                List.of("FOOD", "WORKOUT", "FASHION", "STUDY", "ETC"),
                List.of("FOOD", "WORKOUT", "DATING", "STUDY", "ETC"),
                List.of("FOOD", "MOVIE", "FASHION", "DATING", "STUDY"),
                List.of("FOOD", "MOVIE", "FASHION", "DATING", "ETC"),
                List.of("FOOD", "MOVIE", "FASHION", "STUDY", "ETC"),
                List.of("FOOD", "MOVIE", "DATING", "STUDY", "ETC"),
                List.of("FOOD", "FASHION", "DATING", "STUDY", "ETC"),
                List.of("WORKOUT", "MOVIE", "FASHION", "DATING", "STUDY"),
                List.of("WORKOUT", "MOVIE", "FASHION", "DATING", "ETC"),
                List.of("WORKOUT", "MOVIE", "FASHION", "STUDY", "ETC"),
                List.of("WORKOUT", "MOVIE", "DATING", "STUDY", "ETC"),
                List.of("WORKOUT", "FASHION", "DATING", "STUDY", "ETC"),
                List.of("MOVIE", "FASHION", "DATING", "STUDY", "ETC")
        );

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
                    .categories(CATEGORY.get(random.nextInt(CATEGORY.size() - 1)).stream().map(str -> Resume.Category.valueOf(str)).collect(Collectors.toSet())) // 카테고리 랜던
                    .member(member)
                    .build();
            resumeRepository.save(resume);
        }
    }
}
