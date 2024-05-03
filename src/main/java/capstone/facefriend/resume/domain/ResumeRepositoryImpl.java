package capstone.facefriend.resume.domain;

import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.domain.member.QMember;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.resume.domain.dto.ResumeHomeDetailResponse;
import capstone.facefriend.resume.domain.dto.ResumeResponse;
import capstone.facefriend.resume.exception.ResumeException;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;
import static capstone.facefriend.resume.domain.QResume.resume;
import static capstone.facefriend.resume.exception.ResumeExceptionType.NO_RESUME;

@Repository
@RequiredArgsConstructor
public class ResumeRepositoryImpl implements ResumeRepositoryCustom {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;
    private final BucketService bucketService;

    private static final List<Integer> GOOD_COMBI_IN_CASE_0 = List.of(2, 4); // 화
    private static final List<Integer> GOOD_COMBI_IN_CASE_1 = List.of(2, 4); // 수
    private static final List<Integer> GOOD_COMBI_IN_CASE_2 = List.of(0, 1); // 목
    private static final List<Integer> GOOD_COMBI_IN_CASE_3 = List.of(1, 4); // 금
    private static final List<Integer> GOOD_COMBI_IN_CASE_4 = List.of(0, 3); // 토

    private static final List<Integer> BAD_COMBI_IN_CASE_0 = List.of(1, 3); // 화
    private static final List<Integer> BAD_COMBI_IN_CASE_1 = List.of(0, 4); // 수
    private static final List<Integer> BAD_COMBI_IN_CASE_2 = List.of(3, 4); // 목
    private static final List<Integer> BAD_COMBI_IN_CASE_3 = List.of(0, 2); // 금
    private static final List<Integer> BAD_COMBI_IN_CASE_4 = List.of(1, 2); // 토

    // 좋은 궁합 동적 쿼리
    public Page<ResumeHomeDetailResponse> getResumesByGoodCombi(Long memberId, Pageable pageable) {
        Member me = findMemberById(memberId);
        Integer faceShapeIdNum = me.getAnalysisInfo().getFaceShapeIdNum();

        BooleanBuilder builder = new BooleanBuilder();
        switch (faceShapeIdNum) {
            case 0: // 화
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(GOOD_COMBI_IN_CASE_0));
                break;
            case 1: // 수
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(GOOD_COMBI_IN_CASE_1));
                break;
            case 2: // 목
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(GOOD_COMBI_IN_CASE_2));
                break;
            case 3: // 금
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(GOOD_COMBI_IN_CASE_3));
                break;
            case 4: // 토
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(GOOD_COMBI_IN_CASE_4));
                break;
        }

        List<ResumeHomeDetailResponse> content = queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(builder) // boolean builder
                .orderBy(resume.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        int total = queryFactory
                .select(resume)
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(builder) // boolean builder
                .fetch()
                .size();

        return new PageImpl<>(content, pageable, total);
    }

    // 나쁜 궁합 동적 쿼리
    public Page<ResumeHomeDetailResponse> getResumesByBadCombi(Long memberId, Pageable pageable) {
        Member me = findMemberById(memberId);
        Integer faceShapeIdNum = me.getAnalysisInfo().getFaceShapeIdNum();

        BooleanBuilder builder = new BooleanBuilder();
        switch (faceShapeIdNum) {
            case 0: // 화
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(BAD_COMBI_IN_CASE_0));
                break;
            case 1: // 수
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(BAD_COMBI_IN_CASE_1));
                break;
            case 2: // 목
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(BAD_COMBI_IN_CASE_2));
                break;
            case 3: // 금
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(BAD_COMBI_IN_CASE_3));
                break;
            case 4: // 토
                builder.and(resume.member.analysisInfo.faceShapeIdNum.in(BAD_COMBI_IN_CASE_4));
                break;
        }

        List<ResumeHomeDetailResponse> content = queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(builder) // boolean builder
                .orderBy(resume.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        int total = queryFactory
                .select(resume)
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(builder) // boolean builder
                .fetch()
                .size();

        return new PageImpl<>(content, pageable, total);
    }

    // 카테고리별 동적 쿼리
    public Page<ResumeHomeDetailResponse> getResumesByCategory(String category, Pageable pageable) {
        List<ResumeHomeDetailResponse> content = queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(resume.category.eq(Resume.Category.valueOf(category)))
                .orderBy(resume.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        int total = queryFactory
                .select(resume)
                .from(resume)
                .leftJoin(resume.member, QMember.member) // left join
                .where(resume.category.eq(Resume.Category.valueOf(category)))
                .fetch()
                .size();

        return new PageImpl<>(content, pageable, total);
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }

    private Resume findResumeByMember(Member member) {
        return resumeRepository.findResumeByMember(member)
                .orElseThrow(() -> new ResumeException(NO_RESUME));
    }
}
