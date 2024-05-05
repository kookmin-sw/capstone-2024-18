package capstone.facefriend.resume.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.resume.domain.dto.*;
import capstone.facefriend.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // 정적 쿼리
    @PostMapping("/my-resume")
    public ResponseEntity<ResumePostPutResponse> postResume(
            @AuthMember Long memberId,
            @RequestPart("images") List<MultipartFile> images,
            @RequestPart("request") ResumePostRequest request
    ) throws IOException {
        return ResponseEntity.ok(resumeService.postResume(memberId, images, request));
    }

    @GetMapping("/resume")
    public ResponseEntity<ResumeGetResponse> getResume(
            @AuthMember Long memberId,
            @RequestParam("resumeId") Long resumeId
    ) {
        return ResponseEntity.ok(resumeService.getResume(memberId, resumeId));
    }

    @GetMapping("/my-resume")
    public ResponseEntity<ResumeGetResponse> getMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.getMyResume(memberId));
    }

    @PutMapping("/my-resume")
    public ResponseEntity<ResumePostPutResponse> putMyResume(
            @AuthMember Long memberId,
            @RequestPart("images") List<MultipartFile> images,
            @RequestPart("request") ResumePutRequest request
    ) throws IOException {
        return ResponseEntity.ok(resumeService.putResume(memberId, images, request));
    }

    @DeleteMapping("/my-resume")
    public ResponseEntity<ResumeDeleteResponse> deleteMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.deleteResume(memberId));
    }

    // 동적 쿼리
    @GetMapping("/resume-by-good-combi")
    public Page<ResumeHomeDetailResponse> getResumesByGoodCombi(
            @AuthMember Long memberId,
            Pageable pageable
    ) {
        return resumeService.getResumesByGoodCombi(memberId, pageable);
    }

    @GetMapping("/resume-by-category")
    public Page<ResumeHomeDetailResponse> getResumesByCategory(
            @AuthMember Long memberId,
            @RequestParam("category") String category,
            Pageable pageable
    ) {
        return resumeService.getResumesByCategory(category, pageable);
    }
}
