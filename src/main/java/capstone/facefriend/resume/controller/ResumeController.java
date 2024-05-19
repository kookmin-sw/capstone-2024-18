package capstone.facefriend.resume.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.resume.service.ResumeService;
import capstone.facefriend.resume.service.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@Slf4j
@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // 정적 쿼리
    @PostMapping(value = "/my-resume")
    public ResponseEntity<ResumePostPutResponse> postMyResume(
            @AuthMember Long memberId,
            @ModelAttribute ResumePostPutRequest request
    ) throws IOException {
        return ResponseEntity.ok(resumeService.postMyResume(memberId, request));
    }

    @GetMapping("/resume")
    public ResponseEntity<ResumeGetResponse> getResumeByResumeId(
            @AuthMember Long memberId,
            @RequestParam("resumeId") Long resumeId
    ) {
        return ResponseEntity.ok(resumeService.getResumeByResumeId(memberId, resumeId));
    }

    @GetMapping("/sender-resume")
    public ResponseEntity<ResumeGetResponse> getResumeBySenderId(
            @AuthMember Long memberId,
            @RequestParam("senderId") Long senderId
    ) {
        return ResponseEntity.ok(resumeService.getResumeBySenderId(memberId, senderId));
    }

    @GetMapping("/my-resume")
    public ResponseEntity<ResumeGetResponse> getMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.getMyResume(memberId));
    }

    @PutMapping(value = "/my-resume")
    public ResponseEntity<ResumePostPutResponse> putMyResume(
            @AuthMember Long memberId,
            @ModelAttribute ResumePostPutRequest request
    ) throws IOException {
        return ResponseEntity.ok(resumeService.putMyResume(memberId, request));
    }

    @DeleteMapping("/my-resume")
    public ResponseEntity<ResumeDeleteResponse> deleteMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.deleteMyResume(memberId));
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
        return resumeService.getResumesByCategory(memberId, category, pageable);
    }
}
