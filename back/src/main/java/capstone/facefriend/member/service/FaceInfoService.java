package capstone.facefriend.member.service;

import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.dto.faceInfo.FaceInfoResponse;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.repository.FaceInfoRepository;
import capstone.facefriend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class FaceInfoService {

    private final BucketService bucketService;
    private final MemberRepository memberRepository;
    private final FaceInfoRepository faceInfoRepository;

    public FaceInfoResponse getOriginAndGenerated(Long memberId) {
        Member member = findMemberById(memberId);
        FaceInfo faceInfo = member.getFaceInfo();
        return new FaceInfoResponse(faceInfo.getOriginS3url(), faceInfo.getGeneratedS3url());
    }

    @Transactional
    public FaceInfoResponse updateOriginAndGenerated(List<String> s3Urls, Long memberId) {

        Member member = findMemberById(memberId);
        FaceInfo faceInfo = faceInfoRepository.findFaceInfoById(member.getFaceInfo().getId());

        String originS3Url = s3Urls.get(0);
        String generatedS3Url = s3Urls.get(1);

        faceInfo.setOriginS3url(originS3Url);
        faceInfo.setGeneratedS3url(generatedS3Url);

        member.setFaceInfo(faceInfo);

        return new FaceInfoResponse(originS3Url, generatedS3Url);
    }

    @Transactional
    public FaceInfoResponse deleteOriginAndGenerated(Long memberId) {
        String defaultFaceInfoS3url = bucketService.deleteOriginAndGenerated(memberId);

        Member member = findMemberById(memberId);
        faceInfoRepository.deleteFaceInfoById(member.getFaceInfo().getId());

        FaceInfo faceInfo = FaceInfo.builder()
                .originS3url(defaultFaceInfoS3url)
                .generatedS3url(defaultFaceInfoS3url)
                .styleId(-1)
                .build();
        faceInfo.setOriginS3url(defaultFaceInfoS3url);
        faceInfo.setGeneratedS3url(defaultFaceInfoS3url);
        faceInfoRepository.save(faceInfo);

        member.setFaceInfo(faceInfo);

        return new FaceInfoResponse(defaultFaceInfoS3url, defaultFaceInfoS3url);
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }
}

