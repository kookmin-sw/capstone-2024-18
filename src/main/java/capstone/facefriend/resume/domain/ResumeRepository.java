package capstone.facefriend.resume.domain;

import capstone.facefriend.member.domain.member.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends Repository<Resume, Long>, ResumeRepositoryCustom {

    Resume save(Resume resume);

    Optional<Resume> findResumeByMember(Member member);

    Optional<Resume> findResumeById(Long id);

    void deleteResumeById(Long id);
}
