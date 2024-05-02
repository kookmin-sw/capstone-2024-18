package capstone.facefriend.resume.service;


import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.domain.ResumeRepository;
import capstone.facefriend.resume.domain.dto.ResumeHomeDetailResponse;
import capstone.facefriend.resume.domain.dto.ResumeRequest;
import capstone.facefriend.resume.domain.dto.ResumeResponse;
import capstone.facefriend.resume.exception.ResumeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;
import static capstone.facefriend.resume.domain.Resume.*;
import static capstone.facefriend.resume.exception.ResumeExceptionType.ALREADY_HAVE_RESUME;
import static capstone.facefriend.resume.exception.ResumeExceptionType.NO_RESUME;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;
    private final BucketService bucketService;

    /** 특정 페이지 **/
    // 나
    public ResumeResponse postResume(Long memberId, List<MultipartFile> images, ResumeRequest request) throws IOException {

        Member member = findMemberById(memberId); // 본인
        if(!resumeRepository.findResumeByMember(member).isPresent()) {
            throw new ResumeException(ALREADY_HAVE_RESUME);
        }

        List<String> resumeImagesS3url = bucketService.uploadResumeImages(images, memberId);
        Resume resume = builder()
                .member(member)
                .resumeImageS3urls(resumeImagesS3url)
                .category(Category.valueOf(request.category()))
                .content(request.content())
                .build();
        resumeRepository.save(resume);

        return new ResumeResponse(
                resume.getId(),
                resume.getMember().getBasicInfo(),
                resume.getMember().getFaceInfo(),
                resume.getMember().getAnalysisInfo(),
                resume.getCategory(),
                resume.getContent()
        );
    }

    // 나 또는 상대
    public ResumeResponse getResume(
            Long resumeId
    ) {
        resumeRepository.findResumeById(resumeId)
                .orElseThrow(() -> new ResumeException(NO_RESUME));
    }

    // 나
    public ResumeResponse putResume(Long resumeId) {

    }

    // 나
    public ResumeResponse deleteResume(Long resumeId) {

    }

    /** 홈 페이지 **/
    // 홈 페이지에서 궁합 좋은 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getHomeResumesByGoodCombi(Long memberId) {

    }

    // 홈페이지에서 궁합 나쁜 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getHomeResumesByBadCombi(Long memberId) {

    }

    // 홈 페이지에서 카테고리별 조회하는 동적 쿼리 (10개)
    public List<ResumeHomeDetailResponse> getHomeResumesByCategory(String category) {

    }


    /** 디테일 페이지 **/
    // 디테일 페이지에서 궁합 좋은 관상 조회하는  동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByGoodCombi(Long memberId) {

    }

    // 디테일 페이지에서 궁합 나쁜 관상 조회하는 동적 쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByBadCombi(Long memberId) {

    }

    // 디테일 페이지에서 카테고리별 동적쿼리 (20개)
    public List<ResumeHomeDetailResponse> getDetailResumesByCategory(String category) {

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
