//package capstone.facefriend.member.service;
//
//
//import capstone.facefriend.auth.controller.support.AuthMember;
//import capstone.facefriend.member.domain.*;
//import capstone.facefriend.member.exception.MemberException;
//import capstone.facefriend.member.exception.MemberExceptionType;
//import capstone.facefriend.member.service.dto.ResumeRequest;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.List;
//
//import static capstone.facefriend.member.exception.MemberExceptionType.*;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class ResumeService {
//
//    private final MemberRepository memberRepository;
//    private final ResumeRepository resumeRepository;
//
//    private final BucketService bucketService;
//
//    @Transactional
//    public void post(List<String> resumeImagesS3Urls, Long memberId, ResumeRequest request) throws IOException {
//        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberException(NOT_FOUND));
//
//        List<ResumeImage> resumeImages = new ArrayList<>();
//        for (String s : resumeImagesS3Urls) {
//            resumeImages.add(ResumeImage.builder().)
//        }
//
//
//    }
//
//    @Transactional
//    public void get(Long memberId) {
//
//    }
//
//    @Transactional
//    public void put(MultipartFile[] resumeImages, String content, Long memberId) {
//
//    }
//
//    @Transactional
//    public void delete(Long memberId) {
//
//    }
//}
