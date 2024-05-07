package capstone.facefriend.bucket;


import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.resume.domain.Resume;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Transactional
@Slf4j
@RequiredArgsConstructor
@Service
public class BucketService {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${spring.cloud.aws.s3.default-faceInfo-s3url}")
    private String defaultFaceInfoS3url;
    @Value("${spring.cloud.aws.s3.origin-postfix}")
    private String originPostfix;
    @Value("${spring.cloud.aws.s3.generated-postfix}")
    private String generatedPostfix;
    @Value("${spring.cloud.aws.s3.resume-postfix}")
    private String resumePostfix;

    private final AmazonS3 amazonS3;
    private final MemberRepository memberRepository;

    // FaceInfo : origin 업로드 & generated 업로드
    public List<String> uploadOriginAndGenerated(
            MultipartFile origin,
            ByteArrayMultipartFile generated
    ) throws IOException {
        /** upload origin to s3 */
        // set metadata
        ObjectMetadata originMetadata = new ObjectMetadata();
        originMetadata.setContentLength(origin.getInputStream().available());
        originMetadata.setContentType(origin.getContentType());

        String originObjectName = UUID.randomUUID() + originPostfix;
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

        String generatedObjectName = UUID.randomUUID() + generatedPostfix;
        amazonS3.putObject(
                new PutObjectRequest(
                        bucketName,
                        generatedObjectName,
                        generated.getInputStream(), // generated
                        generatedMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String generatedS3url = amazonS3.getUrl(bucketName, generatedObjectName).toString();

        return List.of(originS3url, generatedS3url);
    }

    // FaceInfo : origin 수정 -> generated 수정
    public List<String> updateOriginAndGenerated(
            MultipartFile origin,
            ByteArrayMultipartFile generated,
            Long memberId
    ) throws IOException {
        Member member = findMemberById(memberId);

        String originS3url = member.getFaceInfo().getOriginS3url();
        String generatedS3url = member.getFaceInfo().getGeneratedS3url();

        if (originS3url.equals(defaultFaceInfoS3url) || generatedS3url.equals(defaultFaceInfoS3url)) {
            return uploadOriginAndGenerated(origin, generated);
        }

        deleteOriginAndGenerated(memberId);
        return uploadOriginAndGenerated(origin, generated);
    }

    // FaceInfo : origin 삭제 -> generated 삭제
    public String deleteOriginAndGenerated(
            Long memberId
    ) {
        Member member = findMemberById(memberId);

        String originS3url = member.getFaceInfo().getOriginS3url();
        String originObjectName = originS3url.substring(originS3url.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, originObjectName));

        String generatedS3url = member.getFaceInfo().getGeneratedS3url();
        String generatedObjectName = generatedS3url.substring(generatedS3url.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, generatedObjectName));

        return defaultFaceInfoS3url;
    }


    // Resume : images 업로드
    public List<String> uploadResumeImages(
            List<MultipartFile> images
    ) throws IOException {

        List<String> resumeImageS3urls = new ArrayList<>();

        for (MultipartFile image : images) {

            if (image.isEmpty() || image.getSize() == 0) {
                return List.of();
            }

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getInputStream().available());
            metadata.setContentType(image.getContentType());

            String imageObjectName = UUID.randomUUID() + resumePostfix;

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

    // Resume : images 삭제 -> images 업로드
    public List<String> updateResumeImages(
            List<MultipartFile> images,
            Resume resume
    ) throws IOException {
        deleteResumeImages(resume);
        return uploadResumeImages(images);
    }

    // Resume : images 삭제
    public void deleteResumeImages(
            Resume resume
    ) {
        List<String> resumeImageS3urls = resume.getResumeImageS3urls();

        for (String resumeImageS3url : resumeImageS3urls) {
            String resumeImageObjectName = resumeImageS3url.substring(resumeImageS3url.lastIndexOf("/") + 1);
            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, resumeImageObjectName));
        }
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }
}

