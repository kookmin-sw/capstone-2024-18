package capstone.facefriend.resume.controller;

import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.resume.dto.ResumeDeleteResponse;
import capstone.facefriend.resume.dto.ResumeGetResponse;
import capstone.facefriend.resume.dto.ResumePreviewResponse;
import capstone.facefriend.resume.dto.ResumePostPutRequest;
import capstone.facefriend.resume.dto.ResumePostPutResponse;
import capstone.facefriend.resume.service.ResumeService;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/resume/mine")
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

    @GetMapping("/resume/sender")
    public ResponseEntity<ResumeGetResponse> getResumeBySenderId(
            @AuthMember Long memberId,
            @RequestParam("senderId") Long senderId
    ) {
        return ResponseEntity.ok(resumeService.getResumeBySenderId(memberId, senderId));
    }

    @GetMapping("/resume/mine")
    public ResponseEntity<ResumeGetResponse> getMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.getMyResume(memberId));
    }

    @PutMapping(value = "/resume/mine")
    public ResponseEntity<ResumePostPutResponse> putMyResume(
            @AuthMember Long memberId,
            @ModelAttribute ResumePostPutRequest request
    ) {
        return ResponseEntity.ok(resumeService.putMyResume(memberId, request));
    }

    @DeleteMapping("/resume/mine")
    public ResponseEntity<ResumeDeleteResponse> deleteMyResume(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(resumeService.deleteMyResume(memberId));
    }

    @GetMapping("/resume/good-combi")
    public Page<ResumePreviewResponse> getResumesByGoodCombi(
            @AuthMember Long memberId,
            Pageable pageable
    ) {
        return resumeService.getResumesByGoodCombi(memberId, pageable);
    }

    @GetMapping("/resume/category")
    public Page<ResumePreviewResponse> getResumesByCategory(
            @AuthMember Long memberId,
            @RequestParam("category") String category,
            Pageable pageable
    ) {
        return resumeService.getResumesByCategory(memberId, category, pageable);
    }
}
