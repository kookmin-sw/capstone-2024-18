package capstone.facefriend.member.service;


import capstone.facefriend.member.domain.FaceInfo;
import capstone.facefriend.member.domain.FaceInfoRepository;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.exception.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.service.dto.FaceInfoResponse;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Service
public class BucketService {

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${default-profile.s3-url}")
    private String defaultProfileS3Url;

    private final AmazonS3 amazonS3;

    private final MemberRepository memberRepository;
    private final FaceInfoRepository faceInfoRepository;

    private static final String ORIGIN_POSTFIX = "-origin";
    private static final String GENERATED_POSTFIX = "-generated";

    // origin 업로드 & generated 업로드
    public FaceInfoResponse upload(MultipartFile origin, ByteArrayMultipartFile generated, Long memberId) throws IOException {
        /** upload origin to s3 */
        // set metadata
        ObjectMetadata originMetadata = new ObjectMetadata();
        originMetadata.setContentLength(origin.getInputStream().available());
        originMetadata.setContentType("image/jpeg");

        String originObjectName = memberId + ORIGIN_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        bucketName,
                        originObjectName,
                        origin.getInputStream(), // origin
                        originMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String originS3Url = amazonS3.getUrl(bucketName, originObjectName).toString();

        /** upload generated to s3 */
        // set metadata
        ObjectMetadata generatedMetadata = new ObjectMetadata();
        generatedMetadata.setContentLength(generated.getInputStream().available());
        generatedMetadata.setContentType("image/jpeg");

        String generatedObjectName = memberId + GENERATED_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        bucketName,
                        generatedObjectName,
                        generated.getInputStream(), // generated
                        generatedMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String generatedS3Url = amazonS3.getUrl(bucketName, generatedObjectName).toString();

        // FaceInfo 저장
        FaceInfo faceInfo = FaceInfo.builder()
                .originS3Url(originS3Url)
                .generatedS3url(generatedS3Url)
                .build();
        faceInfoRepository.save(faceInfo);

        // Member 최신화 후 저장
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
        member.setFaceInfo(faceInfo);
        memberRepository.save(member);

        return new FaceInfoResponse(originS3Url, generatedS3Url);
    }

    // origin 수정 -> generated 수정
    public FaceInfoResponse update(MultipartFile origin, ByteArrayMultipartFile generated, Long memberId) throws IOException {
        delete(memberId); // 기존에 저장되어있던 사진 삭제
        return upload(origin, generated, memberId); // 새로 사진 저장
    }

    // origin 삭제 -> generated 삭제
    public FaceInfoResponse delete(Long memberId) {
        String originObjectName = memberId + ORIGIN_POSTFIX;
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, originObjectName));

        String generatedObjectName = memberId + GENERATED_POSTFIX;
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, generatedObjectName));

        return new FaceInfoResponse(defaultProfileS3Url, defaultProfileS3Url);
    }
}

