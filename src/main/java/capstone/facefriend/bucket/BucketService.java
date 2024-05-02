package capstone.facefriend.bucket;


import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfoRepository;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.service.dto.faceInfo.FaceInfoResponse;
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
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class BucketService {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${spring.cloud.aws.s3.default-profile}")
    private String defaultProfileS3Url;

    @Value("${spring.cloud.aws.s3.origin-postfix}")
    private String originPostfix;

    @Value("${spring.cloud.aws.s3.generated-postfix}")
    private String generatedPostfix;

    @Value("${spring.cloud.aws.s3.resume-postfix}")
    private String resumeInfix;

    private final AmazonS3 amazonS3;
    private final MemberRepository memberRepository;
    private final FaceInfoRepository faceInfoRepository;

    // FaceInfo : origin 업로드 & generated 업로드
    public FaceInfoResponse uploadOriginAndGenerated(MultipartFile origin, ByteArrayMultipartFile generated, Long memberId) throws IOException {
        /** upload origin to s3 */
        // set metadata
        ObjectMetadata originMetadata = new ObjectMetadata();
        originMetadata.setContentLength(origin.getInputStream().available());
        originMetadata.setContentType(origin.getContentType());
        String originObjectName = memberId + originPostfix;
        amazonS3.putObject(
                new PutObjectRequest(
                        bucketName,
                        originObjectName,
                        origin.getInputStream(), // origin
                        originMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String originS3url = amazonS3.getUrl(bucketName, originObjectName).toString();

        /** upload generated to s3 */
        // set metadata
        ObjectMetadata generatedMetadata = new ObjectMetadata();
        generatedMetadata.setContentLength(generated.getInputStream().available());
        generatedMetadata.setContentType(generatedMetadata.getContentType());

        String generatedObjectName = memberId + generatedPostfix;
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
                .originS3url(originS3url)
                .generatedS3url(generatedS3Url)
                .build();
        faceInfoRepository.save(faceInfo); //

        // Member 최신화 후 저장
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
        member.setFaceInfo(faceInfo);
        memberRepository.save(member);

        return new FaceInfoResponse(originS3url, generatedS3Url);
    }

    // FaceInfo : origin 수정 -> generated 수정
    public FaceInfoResponse updateOriginAndGenerated(MultipartFile origin, ByteArrayMultipartFile generated, Long memberId) throws IOException {
        deleteOriginAndGenerated(memberId); // 기존에 저장되어있던 사진 삭제
        return uploadOriginAndGenerated(origin, generated, memberId); // 새로 사진 저장
    }

    // FaceInfo : origin 삭제 -> generated 삭제
    public FaceInfoResponse deleteOriginAndGenerated(Long memberId) {
        String originObjectName = memberId + originPostfix;
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, originObjectName));

        String generatedObjectName = memberId + generatedPostfix;
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, generatedObjectName));

        return new FaceInfoResponse(defaultProfileS3Url, defaultProfileS3Url);
    }

    public List<String> uploadResumeImages(List<MultipartFile> images, Long memberId) throws IOException {
        int start = 0;
        List<String> resumeImageS3urls = new ArrayList<>();

        for (MultipartFile image : images) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getInputStream().available());
            metadata.setContentType(image.getContentType());

            String imageObjectName = memberId + resumeInfix + start;
            amazonS3.putObject(
                    new PutObjectRequest(
                            bucketName,
                            imageObjectName,
                            image.getInputStream(),
                            metadata
                    ).withCannedAcl(CannedAccessControlList.PublicRead)
            );

            resumeImageS3urls.add(amazonS3.getUrl(bucketName, imageObjectName).toString());
        }

        return resumeImageS3urls;
    }

    public List<String> updateResumeImages() {
        return null;
    }

    public List<String> deleteResumeImages(Long memberId) {
        String imageObjectName = memberId + resumeInfix +
    }
}

