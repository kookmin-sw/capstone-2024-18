package capstone.facefriend.bucket;


import static capstone.facefriend.bucket.BucketExceptionType.FAIL_TO_GET_INPUT_STREAM;

import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.resume.domain.Resume;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Transactional
@RequiredArgsConstructor
@Service
public class BucketService {

    @Value("${cloud.aws.s3.bucket}")
    private String BUCKET_NAME;
    @Value("${cloud.aws.s3.default-profile}")
    private String DEFAULT_FACE_INFO_S3_URL;
    @Value("${cloud.aws.s3.origin-postfix}")
    private String ORIGIN_POSTFIX;
    @Value("${cloud.aws.s3.generated-postfix}")
    private String GENERATED_POSTFIX;
    @Value("${cloud.aws.s3.resume-postfix}")
    private String RESUME_POSTFIX;

    private final AmazonS3 amazonS3;
    private final MemberRepository memberRepository;

    public List<String> putOriginAndGenerated(
            MultipartFile origin,
            ByteArrayMultipartFile generated,
            Long memberId
    ) {
        Member member = findMemberById(memberId);

        String originS3url = member.getFaceInfo().getOriginS3url();
        String generatedS3url = member.getFaceInfo().getGeneratedS3url();

        if (originS3url.equals(DEFAULT_FACE_INFO_S3_URL) || generatedS3url.equals(DEFAULT_FACE_INFO_S3_URL)) {
            return putOriginAndGenerated(origin, generated);
        }

        deleteOriginAndGenerated(memberId);
        return putOriginAndGenerated(origin, generated);
    }

    private List<String> putOriginAndGenerated(
            MultipartFile origin,
            ByteArrayMultipartFile generated
    ) {
        String originS3url = putOriginS3Url(origin);
        String generatedS3url = putGeneratedS3url(generated);
        return List.of(originS3url, generatedS3url);
    }

    private String putOriginS3Url(MultipartFile origin) {
        ObjectMetadata originMetadata;
        InputStream originInputStream;

        try {
            originMetadata = new ObjectMetadata();
            originInputStream = origin.getInputStream();
            originMetadata.setContentLength(originInputStream.available());
            originMetadata.setContentType(origin.getContentType());
        } catch (IOException e) {
            throw new BucketException(FAIL_TO_GET_INPUT_STREAM);
        }
        String originObjectName = UUID.randomUUID() + ORIGIN_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        BUCKET_NAME,
                        originObjectName,
                        originInputStream,
                        originMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        return amazonS3.getUrl(BUCKET_NAME, originObjectName).toString();
    }

    private String putGeneratedS3url(MultipartFile generated) {
        ObjectMetadata generatedMetadata;
        InputStream generatedInputStream;
        try {
            generatedMetadata = new ObjectMetadata();
            generatedInputStream = generated.getInputStream();
            generatedMetadata.setContentLength(generatedInputStream.available());
            generatedMetadata.setContentType(generatedMetadata.getContentType());
        } catch (IOException e) {
            throw new BucketException(FAIL_TO_GET_INPUT_STREAM);
        }

        String generatedObjectName = UUID.randomUUID() + GENERATED_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        BUCKET_NAME,
                        generatedObjectName,
                        generatedInputStream,
                        generatedMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );

        return amazonS3.getUrl(BUCKET_NAME, generatedObjectName).toString();
    }

    public String deleteOriginAndGenerated(
            Long memberId
    ) {
        Member member = findMemberById(memberId);

        String originS3url = member.getFaceInfo().getOriginS3url();
        String originObjectName = originS3url.substring(originS3url.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, originObjectName));

        String generatedS3url = member.getFaceInfo().getGeneratedS3url();
        String generatedObjectName = generatedS3url.substring(generatedS3url.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, generatedObjectName));

        return DEFAULT_FACE_INFO_S3_URL;
    }

    public List<String> uploadResumeImages(
            List<MultipartFile> images
    ) throws IOException {

        List<String> resumeImageS3urls = new ArrayList<>();

        if (images != null) {
            for (MultipartFile image : images) {
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(image.getInputStream().available());
                metadata.setContentType(image.getContentType());

                String imageObjectName = UUID.randomUUID() + RESUME_POSTFIX;

                amazonS3.putObject(
                        new PutObjectRequest(
                                BUCKET_NAME,
                                imageObjectName,
                                image.getInputStream(),
                                metadata
                        ).withCannedAcl(CannedAccessControlList.PublicRead)
                );
                resumeImageS3urls.add(amazonS3.getUrl(BUCKET_NAME, imageObjectName).toString());
            }
        }
        return resumeImageS3urls;
    }

    public List<String> putResumeImages(
            List<MultipartFile> images,
            Resume resume
    ) throws IOException {
        deleteResumeImages(resume);
        return uploadResumeImages(images);
    }

    public void deleteResumeImages(
            Resume resume
    ) {
        List<String> resumeImageS3urls = resume.getResumeImageS3urls();

        for (String resumeImageS3url : resumeImageS3urls) {
            String resumeImageObjectName = resumeImageS3url.substring(resumeImageS3url.lastIndexOf("/") + 1);
            amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, resumeImageObjectName));
        }
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }
}

