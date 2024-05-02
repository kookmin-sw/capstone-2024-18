package capstone.facefriend.resume.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.resume.domain.dto.ResumeHomeDetailResponse;
import capstone.facefriend.resume.domain.dto.ResumeRequest;
import capstone.facefriend.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /** 특정 페이지 **/
    @PostMapping("/resume")
    public ResponseEntity postResume(
            @RequestPart List<MultipartFile> images,
            @AuthMember Long memberId,
            ResumeRequest request
    ) throws IOException {
        resumeService.postResume(memberId, images, request);

    }


    /** 홈 페이지 **/
    @GetMapping("/resume")
    public List<ResumeHomeDetailResponse> getHomeResumesByGoodCombi(
            @AuthMember Long memberId
    ) {
        return resumeService.getHomeResumesByGoodCombi(memberId);
    }

    @GetMapping("/resume")
    public List<ResumeHomeDetailResponse> getHomeResumesByBadCombi(
            @AuthMember Long memberId
    ) {
        return resumeService.getHomeResumesByBadCombi(memberId)
    }

    @GetMapping("/resume")
    public List<ResumeHomeDetailResponse> getDetailResumesByCategory(
            @AuthMember Long memberId,
            String category
    ) {
        return resumeService.getDetailResumesByCategory(category)
    }

    /** 디테일 페이지 **/

}
