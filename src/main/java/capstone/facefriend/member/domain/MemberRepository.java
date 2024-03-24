package capstone.facefriend.member.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface MemberRepository extends Repository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Member save(Member member);

    boolean existsById(Long id);

    Optional<Member> findById(Long id);

    Page<Member> findAll(Pageable pageable);
}
