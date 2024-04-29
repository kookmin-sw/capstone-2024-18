//package capstone.facefriend.member.controller;
//
//import capstone.facefriend.auth.controller.support.AuthMember;
//import capstone.facefriend.member.service.BucketService;
//import capstone.facefriend.member.service.dto.ResumeRequest;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//
//@Slf4j
//@RestController
//@RequiredArgsConstructor
//public class ResumeController {
//
//    //    private final ResumeService resumeService;
//    private final BucketService bucketService;
//
//    @PostMapping("/resume")
//    public ResponseEntity<String> post(
//            @RequestPart("resumeImages") MultipartFile[] resumeImages,
//            @AuthMember Long memberId,
//            @RequestPart ResumeRequest request
//    ) throws IOException {
//        List<String> resumeImageS3Urls = bucketService.uploadResumeImages(resumeImages, memberId);
//        resumeService.post(resumeImageS3Urls, memberId, request);
//
//
//        return ResponseEntity.ok("");
//    }
//
//    @GetMapping("/resume")
//    public ResponseEntity<String> get(
//            @AuthMember Long memberId
//    ) {
//        resumeService.get(memberId);
//        return ResponseEntity.ok("");
//    }
//
//    @PutMapping("/resume")
//    public ResponseEntity<String> put(
//            @RequestPart("resumeImages") MultipartFile[] resumeImages,
//            @RequestBody String content,
//            @AuthMember Long memberId
//    ) {
//        resumeService.put(resumeImages, content, memberId);
//        return ResponseEntity.ok("");
//    }
//
//    @DeleteMapping("/resume")
//    public ResponseEntity<String> delete(
//            @AuthMember Long memberId
//    ) {
//        resumeService.delete(memberId);
//        return ResponseEntity.ok("");
//    }
//}
