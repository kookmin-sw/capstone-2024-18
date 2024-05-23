package capstone.facefriend.member.domain.member;

import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface MemberRepository extends Repository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Member save(Member member);

    Optional<Member> findById(Long id);

    void deleteById(Long id);
}
