package capstone.facefriend.resume.service;


import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.dto.*;
import capstone.facefriend.resume.repository.ResumeRepository;
import capstone.facefriend.resume.exception.ResumeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;
import static capstone.facefriend.resume.domain.Resume.Category;
import static capstone.facefriend.resume.exception.ResumeExceptionType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final MemberRepository memberRepository;
    private final BucketService bucketService;

    private static final String DELETE_SUCCESS_MESSAGE = "자기소개서 삭제 완료!";

    // 정적 쿼리
    public ResumePostPutResponse postMyResume(
            Long memberId,
            ResumePostPutRequest request
    ) throws IOException {

        validateCategories(request.categories());
        Member member = validateMemberHasResume(memberId);

        List<String> resumeImagesS3url = bucketService.uploadResumeImages(request.images());

        Resume resume = Resume.builder()
                .member(member)
                .resumeImageS3urls(resumeImagesS3url)
                .categories(request.categories().stream().map(str -> Category.valueOf(str)).collect(Collectors.toSet()))
                .content(request.content())
                .build();
        resumeRepository.save(resume);

        return new ResumePostPutResponse(
                resume.getId(),
                memberId,
                resume.getResumeImageS3urls(),
                resume.getMember().getFaceInfo(),
                resume.getMember().getBasicInfo(),
                resume.getMember().getAnalysisInfo(),
                resume.getCategories(),
                resume.getContent()
        );
    }

    public ResumeGetResponse getResumeByResumeId(
            Long memberId,
            Long resumeId
    ) {
        Resume resume = resumeRepository.findResumeById(resumeId)
                .orElseThrow(() -> new ResumeException(NO_RESUME));

        Member me = findMemberById(memberId);
        Long mine = findResumeByMember(me).getId();

        Boolean isMine = (resumeId == mine) ? Boolean.TRUE : Boolean.FALSE;

        return new ResumeGetResponse(
                resume.getId(),
                resume.getMember().getId(),
                resume.getResumeImageS3urls(),
                resume.getMember().getFaceInfo(),
                resume.getMember().getBasicInfo(),
                resume.getMember().getAnalysisInfo(),
                resume.getCategories(),
                resume.getContent(),
                isMine
        );
    }

    public ResumeGetResponse getResumeBySenderId(
            Long memberId,
            Long senderId
    ) {
        Member sender = findMemberById(senderId);
        Resume senderResume = findResumeByMember(sender);

        return new ResumeGetResponse(
                senderResume.getId(),
                senderResume.getMember().getId(),
                senderResume.getResumeImageS3urls(),
                senderResume.getMember().getFaceInfo(),
                senderResume.getMember().getBasicInfo(),
                senderResume.getMember().getAnalysisInfo(),
                senderResume.getCategories(),
                senderResume.getContent(),
                Boolean.FALSE
        );
    }

    public ResumeGetResponse getMyResume(
            Long memberId
    ) {
        Member member = findMemberById(memberId);
        Resume mine = findResumeByMember(member);

        return new ResumeGetResponse(
                mine.getId(),
                mine.getMember().getId(),
                mine.getResumeImageS3urls(),
                mine.getMember().getFaceInfo(),
                mine.getMember().getBasicInfo(),
                mine.getMember().getAnalysisInfo(),
                mine.getCategories(),
                mine.getContent(),
                Boolean.TRUE
        );
    }

    @Transactional
    public ResumePostPutResponse putMyResume(
            Long memberId,
            ResumePostPutRequest request
    ) throws IOException {

        validateCategories(request.categories());

        Member me = findMemberById(memberId);
        Resume mine = findResumeByMember(me); // 영속 상태

        if (request.images().size() == 0 || request.images() == null) {
            throw new ResumeException(MUST_UPLOAD_ONE_IMAGE);
        }

        List<String> resumeImageS3urls = bucketService.updateResumeImages(request.images(), mine);

        mine.setResumeImageS3urls(resumeImageS3urls); // dirty check
        mine.setCategories(request.categories().stream().map(str -> Category.valueOf(str)).collect(Collectors.toSet())); // dirty check
        mine.setContent(request.content()); // dirty check

        return new ResumePostPutResponse(
                mine.getId(),
                memberId,
                mine.getResumeImageS3urls(),
                mine.getMember().getFaceInfo(),
                mine.getMember().getBasicInfo(),
                mine.getMember().getAnalysisInfo(),
                mine.getCategories(),
                mine.getContent()
        );
    }

    @Transactional
    public ResumeDeleteResponse deleteMyResume(
            Long memberId
    ) {
        Member me = findMemberById(memberId);
        Resume mine = findResumeByMember(me);

        bucketService.deleteResumeImages(mine);
        resumeRepository.deleteResumeById(mine.getId());

        return new ResumeDeleteResponse(DELETE_SUCCESS_MESSAGE);
    }

    // 동적 쿼리
    public Page<ResumeHomeDetailResponse> getResumesByGoodCombi(Long memberId, Pageable pageable) {
        return resumeRepository.getResumesByGoodCombi(memberId, pageable);
    }

    public Page<ResumeHomeDetailResponse> getResumesByCategory(Long memberId, String category, Pageable pageable) {
        return resumeRepository.getResumesByCategory(memberId, category, pageable);
    }

    // 내부 로직용
    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }

    private Resume findResumeByMember(Member member) {
        return resumeRepository.findResumeByMember(member)
                .orElseThrow(() -> new ResumeException(NO_RESUME));
    }

    private void validateCategories(List<String> categories) {
        if (categories == null || categories.size() == 0 || categories.isEmpty()) { // null validation 먼저
            throw new ResumeException(MUST_SELECT_ONE_CATEGORY);
        }
    }

    private Member validateMemberHasResume(Long memberId){
        Member member = findMemberById(memberId);
        if (resumeRepository.findResumeByMember(member).isPresent()) {
            throw new ResumeException(ALREADY_HAS_RESUME);
        }
        return member;
    }
}
