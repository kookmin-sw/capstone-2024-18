package capstone.facefriend.resume.domain;

import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.domain.member.QMember;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.resume.domain.dto.ResumeHomeDetailResponse;
import capstone.facefriend.resume.domain.dto.ResumeResponse;
import capstone.facefriend.resume.exception.ResumeException;
import capstone.facefriend.resume.exception.ResumeExceptionType;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;
import static capstone.facefriend.resume.domain.QResume.resume;
import static capstone.facefriend.resume.exception.ResumeExceptionType.*;
import static capstone.facefriend.resume.exception.ResumeExceptionType.NO_RESUME;

@Repository
@RequiredArgsConstructor
public class ResumeRepositoryImpl implements ResumeRepositoryCustom {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    private final MemberRepository memberRepository;
    private final ResumeRepository resumeRepository;
    private final BucketService bucketService;

    private static final List<Integer> GOOD_COMBI_IN_CASE_0 = List.of(2,4); // 화
    private static final List<Integer> GOOD_COMBI_IN_CASE_1 = List.of(2,4); // 수
    private static final List<Integer> GOOD_COMBI_IN_CASE_2 = List.of(0,1); // 목
    private static final List<Integer> GOOD_COMBI_IN_CASE_3 = List.of(1,4); // 금
    private static final List<Integer> GOOD_COMBI_IN_CASE_4 = List.of(0,3); // 토

    private static final List<Integer> BAD_COMBI_IN_CASE_0 = List.of(1,3); // 화
    private static final List<Integer> BAD_COMBI_IN_CASE_1 = List.of(0,4); // 수
    private static final List<Integer> BAD_COMBI_IN_CASE_2 = List.of(3,4); // 목
    private static final List<Integer> BAD_COMBI_IN_CASE_3 = List.of(0,2); // 금
    private static final List<Integer> BAD_COMBI_IN_CASE_4 = List.of(1,2); // 토


    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }

    private Resume findResumeByMember(Member member) {
        return resumeRepository.findResumeByMember(member)
                .orElseThrow(() -> new ResumeException(NO_RESUME));
    }

    /** 특정 페이지 **/
    public ResumeResponse postResume() {

    }

    public ResumeResponse getResume(Long resumeId) {

    }

    public ResumeResponse putResume(Long resumeId) {

    }

    public ResumeResponse deleteResume(Long resumeId) {

    }

    /** 홈 페이지 **/
    // 홈 페이지에서 궁합 좋은 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getHomeResumesByGoodCombi(Long memberId, Pageable pageable) {
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

        List<ResumeHomeDetailResponse> results = queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(builder)
                .orderBy(resume.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


    }

    // 홈페이지에서 궁합 나쁜 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getHomeResumesByBadCombi(Long memberId, Pageable pageable) {
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

        return queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                        ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(builder)
                .orderBy(resume.id.desc())
                .offset(0)
                .limit(10)
                .fetch();
    }
}

    // 홈 페이지에서 카테고리별 조회하는 동적 쿼리 (10개)
    public List<ResumeHomeDetailResponse> getHomeResumesByCategory(String category, Pageable pageable) {
        return queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(resume.category.eq(Resume.Category.valueOf(category)))
                .orderBy(resume.id.desc())
                .offset(0)
                .limit(10)
                .fetch();
    }


    /** 디테일 페이지 **/
    // 디테일 페이지에서 궁합 좋은 관상 조회하는  동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByGoodCombi(Long memberId, Pageable pageable) {
        Member member = findMemberById(memberId);
        Integer faceShapeIdNum = member.getAnalysisInfo().getFaceShapeIdNum();

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

        return queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(builder)
                .orderBy(resume.id.desc())
                .offset(0)
                .limit(20)
                .fetch();
    }

    // 디테일 페이지에서 궁합 나쁜 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByBadCombi(Long memberId, Pageable pageable) {
        Member member = findMemberById(memberId);
        Integer faceShapeIdNum = member.getAnalysisInfo().getFaceShapeIdNum();

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

        return queryFactory
                .select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(builder)
                .orderBy(resume.id.desc())
                .offset(0)
                .limit(20)
                .fetch();
    }

    // 디테일 페이지에서 카테고리별 동적쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByCategory(String category, Pageable pageable) {
        return queryFactory.select(Projections.bean(ResumeHomeDetailResponse.class,
                        resume.id,
                        resume.member.faceInfo.generatedS3url
                ))
                .from(resume)
                .leftJoin(resume.member, QMember.member) // join
                .where(resume.category.eq(Resume.Category.valueOf(category)))
                .orderBy(resume.id.desc())
                .offset(0)
                .limit(20)
                .fetch();
    }
}
