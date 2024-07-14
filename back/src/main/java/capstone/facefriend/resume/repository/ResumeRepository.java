package capstone.facefriend.resume.repository;

import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.resume.domain.Resume;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface ResumeRepository extends Repository<Resume, Long>, ResumeRepositoryCustom {

    Resume save(Resume resume);

    Optional<Resume> findResumeByMember(Member member);

    Optional<Resume> findResumeById(Long id);

    void deleteResumeById(Long id);
}
