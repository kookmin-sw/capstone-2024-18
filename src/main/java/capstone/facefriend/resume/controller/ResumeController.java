package capstone.facefriend.resume.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.resume.domain.dto.*;
import capstone.facefriend.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Slf4j
@RestController
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    // 정적 쿼리
    @PostMapping(value = "/my-resume")
    public ResponseEntity<ResumePostPutResponse> postMyResume(
            @AuthMember Long memberId,
            @RequestPart(value = "image1", required = false) MultipartFile image1,
            @RequestPart(value = "image2", required = false) MultipartFile image2,
            @RequestPart(value = "image3", required = false) MultipartFile image3,
            @RequestPart(value = "image4", required = false) MultipartFile image4,
            @RequestPart(value = "image5", required = false) MultipartFile image5,
            @RequestPart(value = "request") ResumePostRequest request
    ) throws IOException {
        List<MultipartFile> images = Stream.of(image1, image2, image3, image4, image5)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        log.info("size = {}", images.size());
        return ResponseEntity.ok(resumeService.postMyResume(memberId, images, request));
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

    @PutMapping(value = "/my-resume", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResumePostPutResponse> putMyResume(
            @AuthMember Long memberId,
            @RequestPart(value = "image1", required = false) MultipartFile image1,
            @RequestPart(value = "image2", required = false) MultipartFile image2,
            @RequestPart(value = "image3", required = false) MultipartFile image3,
            @RequestPart(value = "image4", required = false) MultipartFile image4,
            @RequestPart(value = "image5", required = false) MultipartFile image5,
            @RequestPart(value = "request") ResumePutRequest request
    ) throws IOException {
        List<MultipartFile> images = Stream.of(image1, image2, image3, image4, image5)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resumeService.putMyResume(memberId, images, request));
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
        return resumeService.getResumesByCategory(category, pageable);
    }
}
