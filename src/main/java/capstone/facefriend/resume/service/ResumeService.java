package capstone.facefriend.resume.service;


import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.resume.domain.Resume;
import capstone.facefriend.resume.domain.ResumeRepository;
import capstone.facefriend.resume.domain.dto.*;
import capstone.facefriend.resume.exception.ResumeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
    public ResumeResponse postResume(
            Long memberId,
            List<MultipartFile> images,
            ResumePostRequest request
    ) throws IOException {

        if (images.size() == 0) {
            throw new ResumeException(AT_LEAST_ONE_IMAGE);
        }

        Member member = findMemberById(memberId);
        if (resumeRepository.findResumeByMember(member).isPresent()) {
            throw new ResumeException(ALREADY_HAS_RESUME);
        }

        List<String> resumeImagesS3url = bucketService.uploadResumeImages(images);

        Resume resume = Resume.builder()
                .member(member)
                .resumeImageS3urls(resumeImagesS3url)
                .category(Category.valueOf(request.category()))
                .content(request.content())
                .build();
        resumeRepository.save(resume);

        return new ResumeResponse(
                resume.getId(),
                resume.getResumeImageS3urls(),
                resume.getMember().getFaceInfo(),
                resume.getMember().getBasicInfo(),
                resume.getMember().getAnalysisInfo(),
                resume.getCategory(),
                resume.getContent()
        );
    }

    public ResumeResponse getResume(
            Long resumeId
    ) {
        Resume resume = resumeRepository.findResumeById(resumeId)
                .orElseThrow(() -> new ResumeException(NO_RESUME));

        return new ResumeResponse(
                resume.getId(),
                resume.getResumeImageS3urls(),
                resume.getMember().getFaceInfo(),
                resume.getMember().getBasicInfo(),
                resume.getMember().getAnalysisInfo(),
                resume.getCategory(),
                resume.getContent()
        );
    }

    public ResumeResponse putResume(
            Long memberId,
            Long resumeId,
            List<MultipartFile> images,
            ResumePutRequest request
    ) throws IOException {
        Member me = findMemberById(memberId);
        Resume myResume = findResumeByMember(me); // dirty check possible

        if (resumeId != myResume.getId()) {
            throw new ResumeException(UNAUTHORIZED);
        }

        List<String> resumeImageS3urls = bucketService.updateResumeImages(images, myResume);

        myResume.setResumeImageS3urls(resumeImageS3urls); // dirty check possible
        myResume.setCategory(Category.valueOf(request.category()));
        myResume.setContent(request.content());

        return new ResumeResponse(
                myResume.getId(),
                myResume.getResumeImageS3urls(),
                myResume.getMember().getFaceInfo(),
                myResume.getMember().getBasicInfo(),
                myResume.getMember().getAnalysisInfo(),
                myResume.getCategory(),
                myResume.getContent()
        );
    }

    public ResumeDeleteResponse deleteResume(
            Long memberId,
            Long resumeId
    ) {
        Member member = findMemberById(memberId); // me
        Resume resume = findResumeByMember(member); // mine

        if (resumeId != resume.getId()) { // if resumeId is not mine
            throw new ResumeException(UNAUTHORIZED);
        }

        bucketService.deleteResumeImages(resume);
        resumeRepository.deleteResumeById(resumeId);

        return new ResumeDeleteResponse(DELETE_SUCCESS_MESSAGE);
    }

    // 동적 쿼리
    public Page<ResumeHomeDetailResponse> getResumesByGoodCombi(Long memberId, Pageable pageable) {
        return resumeRepository.getResumesByGoodCombi(memberId, pageable);
    }

    public Page<ResumeHomeDetailResponse> getResumesByCategory(String category, Pageable pageable) {
        return resumeRepository.getResumesByCategory(category, pageable);
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
}
