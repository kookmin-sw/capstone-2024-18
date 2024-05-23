package capstone.facefriend.bucket;


import capstone.facefriend.chat.domain.ChatRoom;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.exception.ChatExceptionType;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.chat.repository.ChatRoomRepository;
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

import static capstone.facefriend.chat.exception.ChatExceptionType.*;

@Transactional
@Slf4j
@RequiredArgsConstructor
@Service
public class BucketService {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String BUCKET_NAME;

    @Value("${spring.cloud.aws.s3.default-faceInfo-s3url}")
    private String DEFAULT_FACE_INFO_S3_URL;
    @Value("${spring.cloud.aws.s3.origin-postfix}")
    private String ORIGIN_POSTFIX;
    @Value("${spring.cloud.aws.s3.generated-postfix}")
    private String GENERATED_POSTFIX;
    @Value("${spring.cloud.aws.s3.resume-postfix}")
    private String RESUME_POSTFIX;
    @Value("${spring.cloud.aws.s3.generated-by-level-postfix}")
    private String GENERATED_BY_LEVEL_POSTFIX;

    private final AmazonS3 amazonS3;
    private final MemberRepository memberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

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

        String originObjectName = UUID.randomUUID() + ORIGIN_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        BUCKET_NAME,
                        originObjectName,
                        origin.getInputStream(), // origin
                        originMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String originS3url = amazonS3.getUrl(BUCKET_NAME, originObjectName).toString();

        /** upload generated to s3 */
        // set metadata
        ObjectMetadata generatedMetadata = new ObjectMetadata();
        generatedMetadata.setContentLength(generated.getInputStream().available());
        generatedMetadata.setContentType(generatedMetadata.getContentType());

        String generatedObjectName = UUID.randomUUID() + GENERATED_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        BUCKET_NAME,
                        generatedObjectName,
                        generated.getInputStream(), // generated
                        generatedMetadata
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        String generatedS3url = amazonS3.getUrl(BUCKET_NAME, generatedObjectName).toString();

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

        if (originS3url.equals(DEFAULT_FACE_INFO_S3_URL) || generatedS3url.equals(DEFAULT_FACE_INFO_S3_URL)) {
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
        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, originObjectName));

        String generatedS3url = member.getFaceInfo().getGeneratedS3url();
        String generatedObjectName = generatedS3url.substring(generatedS3url.lastIndexOf("/") + 1);
        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, generatedObjectName));

        return DEFAULT_FACE_INFO_S3_URL;
    }


    // Resume : images 업로드
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
            amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, resumeImageObjectName));
        }
    }


    // FaceInfoByLevel : generatedByLevel 업로드
    public String uploadGeneratedByLevel(
            MultipartFile generatedByLevel
    ) throws IOException {
        // set metadata
        ObjectMetadata generatedByLevelMetaData = new ObjectMetadata();
        generatedByLevelMetaData.setContentLength(generatedByLevel.getInputStream().available());
        generatedByLevelMetaData.setContentType(generatedByLevel.getContentType());

        String generatedByLevelObjectName = UUID.randomUUID() + GENERATED_BY_LEVEL_POSTFIX;
        amazonS3.putObject(
                new PutObjectRequest(
                        BUCKET_NAME,
                        generatedByLevelObjectName,
                        generatedByLevel.getInputStream(), // origin
                        generatedByLevelMetaData
                ).withCannedAcl(CannedAccessControlList.PublicRead)
        );
        return amazonS3.getUrl(BUCKET_NAME, generatedByLevelObjectName).toString();
    }

    // FaceInfoByLevel : generatedByLevel 수정 = generatedByLevel 삭제 후 업로드
    public String updateGeneratedByLevel(
            ByteArrayMultipartFile generatedByLevel,
            Long roomId
    ) throws IOException {
        deleteGeneratedByLevel(roomId);
        return uploadGeneratedByLevel(generatedByLevel);
    }

    // FaceInfo : generatedByLevel 삭제
    public void deleteGeneratedByLevel(
            Long roomId // 삭제 요청된 방
    ) {
        ChatRoom chatRoom = findChatRoomByRoomId(roomId);
        ChatRoomMember chatRoomMember = findChatRoomMemberByChatRoom(chatRoom);

        String senderGeneratedByLevelS3url = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
        String receiverGeneratedByLevelS3url = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();

        String senderGeneratedByLevelObjectName = senderGeneratedByLevelS3url.substring(senderGeneratedByLevelS3url.lastIndexOf("/") + 1);
        String receiverGeneratedByLevelObjectName = receiverGeneratedByLevelS3url.substring(receiverGeneratedByLevelS3url.lastIndexOf("/") + 1);

        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, senderGeneratedByLevelObjectName));
        amazonS3.deleteObject(new DeleteObjectRequest(BUCKET_NAME, receiverGeneratedByLevelObjectName));
    }

    private ChatRoomMember findChatRoomMemberByChatRoom(ChatRoom chatRoom) {
        return chatRoomMemberRepository.findChatRoomMemberByChatRoom(chatRoom).orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER));
    }

    private ChatRoom findChatRoomByRoomId(Long roomId) {
        return chatRoomRepository.findById(roomId).orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM));
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }
}

