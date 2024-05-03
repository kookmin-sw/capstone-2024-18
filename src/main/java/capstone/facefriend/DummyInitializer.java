package capstone.facefriend;

import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.domain.ResumeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DummyInitializer {

    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;

    @PostConstruct
    public void init() {

        for (long i = 0; i < 100; i++) {
            Member member = Member.builder().id(i).build();
            memberRepository.save(member);

            Resume resume = Resume.builder().id(i).member(member).build();
            resumeRepository.save(resume);
        }
    }
}
