package capstone.facefriend.chat.aop;

import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.chat.domain.ChatMessage;
import capstone.facefriend.chat.domain.ChatRoomMember;
import capstone.facefriend.chat.exception.ChatException;
import capstone.facefriend.chat.repository.ChatMessageRepository;
import capstone.facefriend.chat.repository.ChatRoomMemberRepository;
import capstone.facefriend.member.domain.faceInfo.FaceInfoByLevel;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.service.FaceInfoService;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;

import static capstone.facefriend.chat.exception.ChatExceptionType.NOT_FOUND_CHAT_ROOM_MEMBER;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;

@Slf4j
@Aspect
@Component
@Transactional
@RequiredArgsConstructor
public class ChatAop {

    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final FaceInfoService faceInfoService;
    private final MemberRepository memberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AmazonS3 amazonS3;
    private final BucketService bucketService;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String BUCKET_NAME;

    public static final int LEVEL_TWO = 5;
    public static final int LEVEL_THREE = 10;
    public static final int LEVEL_FOUR = 15;

    @Pointcut("execution(* capstone.facefriend.chat.service.MessageService.sendHeart(..))")
    private void sendHeart() {
    }

    // 하트를 보낼 때 senderFaceInfoByLevel, receiverFaceInfoByLevel 의 generatedByLevel 필드를 generated 로 초기화하므로 after 이어야만 한다.
    // 하트 거절하면 findChatRoomMemberBySenderAndReceiver 에서 예외 터트릴거임
    @Transactional
    @After("sendHeart()")
    public void afterSendHeart(JoinPoint joinPoint) throws IOException {

        Object[] params = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Long senderId = -1L;
        Long receiveId = -1L;
        for (int i = 0; i < method.getParameters().length; i++) {
            String paramName = method.getParameters()[i].getName();
            if (paramName.equals("senderId")) {
                senderId = (Long) params[i];
            }
            if (paramName.equals("receiveId")) {
                receiveId = (Long) params[i];
            }
        }

        Member sender = findMemberById(senderId); // 영속
        Member receiver = findMemberById(receiveId); // 영속

        ChatRoomMember chatRoomMember = findChatRoomMemberBySenderAndReceiver(sender, receiver); // 영속

        // senderGeneratedByLevel 은 generated 로 DB 저장되어있음
        String senderGeneratedByLevelS3url = chatRoomMember.getSenderFaceInfoByLevel().getGeneratedByLevelS3url();
        // generated 를 MultipartFile 형태로 얻어내고 이를 level 1 로 generatedByLevel 를 S3 업로드 (generated 자체가 level 1)
        ByteArrayMultipartFile senderGeneratedByLevel = getGeneratedByLevel(senderGeneratedByLevelS3url);
        String newSenderGeneratedByLevelS3url = bucketService.uploadGeneratedByLevel(senderGeneratedByLevel);
        // senderGeneratedByLevelS3url 수정
        chatRoomMember.getSenderFaceInfoByLevel().setGeneratedByLevelS3url(newSenderGeneratedByLevelS3url); // dirty check

        // receiverGeneratedByLevel 은 generated 로 DB 저장되어있음
        String receiverGeneratedByLevelS3url = chatRoomMember.getReceiverFaceInfoByLevel().getGeneratedByLevelS3url();
        // generated 를 MultipartFile 형태로 얻어내고 이를 level 1 로 generatedByLevel 를 S3 업로드 (generated 자체가 level 1)
        ByteArrayMultipartFile receiverGenerated = getGeneratedByLevel(receiverGeneratedByLevelS3url);
        String newReceiverGeneratedByLevelS3url = bucketService.uploadGeneratedByLevel(receiverGenerated);
        // receiverGeneratedByLevelS3url 수정
        chatRoomMember.getReceiverFaceInfoByLevel().setGeneratedByLevelS3url(newReceiverGeneratedByLevelS3url); // dirty check
    }

    private ChatRoomMember findChatRoomMemberBySenderAndReceiver(Member sender, Member receiver) {
        return chatRoomMemberRepository.findChatRoomMemberBySenderAndReceiver(sender, receiver)
                .orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER));
    }

    @Pointcut("execution(* capstone.facefriend.chat.repository.ChatMessageRepository.save(..))")
    private void saveChatMessage() {
    }

    // 본인이 보낸 chatMessage 를 저장하기 전마다 chatMessage 가 속한 chatRoom 의 모든 chatMessage 갯수를 count 하고 특정 수준을 넘는지를 확인한다.
    // 수준에 따라 가중치를 조절해 generate_face_by_level() 호출하여 인공지능 서버에 이미지 생성을 요청한다.
    // 또한 가중치 이미지를 s3에 업데이트하고 그 url을 db에 저장한다.
    @Transactional
    @Before("saveChatMessage()")
    public void beforeSaveChatMessage(JoinPoint joinPoint) throws IOException {

        Object[] params = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        ChatMessage chatMessage = null;
        for (int i = 0; i < method.getParameters().length; i++) {
            String paramName = method.getParameters()[i].getName();
            if (paramName.equals("chatMessage")) {
                chatMessage = (ChatMessage) params[i];
            }
        }

        Long roomId = chatMessage.getChatRoom().getId();
        Member me = chatMessage.getSender();

        ChatRoomMember chatRoomMember = findChatRoomMemberByRoomId(roomId); // 영속
        FaceInfoByLevel senderFaceInfoByLevel = chatRoomMember.getSenderFaceInfoByLevel(); // 영속
        FaceInfoByLevel receiverFaceInfoByLevel = chatRoomMember.getReceiverFaceInfoByLevel(); // 영속

        // 나는 최초의 sender 일 수도, receiver 일 수도 있다.
        Member sender = chatRoomMember.getSender();
        Member receiver = chatRoomMember.getReceiver();

        // chatRoom 의 chatMessage 객체의 갯수 count
        Integer chatMessageCount = chatMessageRepository.countChatMessagesByChatRoom(chatMessage.getChatRoom());

        /** param 1 : convert originS3url into MultipartFile **/
        ByteArrayMultipartFile senderOrigin = getOrigin(sender);
        ByteArrayMultipartFile receiverOrigin = getOrigin(receiver);
        /** param 2 : styleId **/
        Integer senderStyleId = sender.getFaceInfo().getStyleId();
        Integer receiverStyleId = receiver.getFaceInfo().getStyleId();
        /** param 3 : memberId **/
        Long senderId = sender.getId();
        Long receiverId = receiver.getId();

        switch (chatMessageCount) {
            case LEVEL_TWO:
                ByteArrayMultipartFile senderGeneratedByLevelTwo = faceInfoService.generateByLevel(senderOrigin, senderId, senderStyleId, 2);
                ByteArrayMultipartFile receiverGeneratedByLevelTwo = faceInfoService.generateByLevel(receiverOrigin, receiverId, receiverStyleId, 2);

                String senderGeneratedByLevelTwoS3url = bucketService.updateGeneratedByLevel(senderGeneratedByLevelTwo, roomId);
                String receiverGeneratedByLevelTwoS3url = bucketService.updateGeneratedByLevel(receiverGeneratedByLevelTwo, roomId);

                senderFaceInfoByLevel.setGeneratedByLevelS3url(senderGeneratedByLevelTwoS3url); // dirty check
                receiverFaceInfoByLevel.setGeneratedByLevelS3url(receiverGeneratedByLevelTwoS3url); // dirty check

            case LEVEL_THREE:
                ByteArrayMultipartFile senderGeneratedByLevelThree = faceInfoService.generateByLevel(senderOrigin, senderId, senderStyleId, 3);
                ByteArrayMultipartFile receiverGeneratedByLevelThree = faceInfoService.generateByLevel(receiverOrigin, receiverId, receiverStyleId, 3);

                String senderGeneratedByLevelThreeS3url = bucketService.updateGeneratedByLevel(senderGeneratedByLevelThree, roomId);
                String receiverGeneratedByLevelThreeS3url = bucketService.updateGeneratedByLevel(receiverGeneratedByLevelThree, roomId);

                senderFaceInfoByLevel.setGeneratedByLevelS3url(senderGeneratedByLevelThreeS3url); // dirty check
                receiverFaceInfoByLevel.setGeneratedByLevelS3url(receiverGeneratedByLevelThreeS3url); // dirty check

            case LEVEL_FOUR:
                ByteArrayMultipartFile senderGeneratedByLevelFour = faceInfoService.generateByLevel(senderOrigin, senderId, senderStyleId, 4);
                ByteArrayMultipartFile receiverGeneratedByLevelFour = faceInfoService.generateByLevel(receiverOrigin, receiverId, receiverStyleId, 4);

                String senderGeneratedByLevelFourS3url = bucketService.updateGeneratedByLevel(senderGeneratedByLevelFour, roomId);
                String receiverGeneratedByLevelFourS3url = bucketService.updateGeneratedByLevel(receiverGeneratedByLevelFour, roomId);

                senderFaceInfoByLevel.setGeneratedByLevelS3url(senderGeneratedByLevelFourS3url); // dirty check
                receiverFaceInfoByLevel.setGeneratedByLevelS3url(receiverGeneratedByLevelFourS3url); // dirty check
        }
    }

    @Pointcut("execution(* capstone.facefriend.chat.service.ChatRoomService.leftRoom(..))")
    private void leftRoom() {
    }

    // 채팅방을 나가면 sender, receiver 의 generatedByLevel 을 모두 삭제한다.
    @Transactional
    @Before("leftRoom()")
    public void beforeLeftRoom(JoinPoint joinPoint) {
        Object[] params = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Long roomId = null;
        Long memberId = null;
        for (int i = 0; i < method.getParameters().length; i++) {
            String paramName = method.getParameters()[i].getName();
            if (paramName.equals("roomId")) {
                roomId = (Long) params[i];
            }
            if (paramName.equals("memberId")) {
                memberId = (Long) params[i];
            }
        }
        bucketService.deleteGeneratedByLevel(roomId);
    }

    private ByteArrayMultipartFile getGeneratedByLevel(String generatedByLevelS3url) throws IOException {
        String generatedByLevelObjectName = generatedByLevelS3url.substring(generatedByLevelS3url.lastIndexOf("/") + 1);
        S3Object generatedByLevelS3Object = amazonS3.getObject(new GetObjectRequest(BUCKET_NAME, generatedByLevelObjectName));

        S3ObjectInputStream generatedByLevelS3inputStream = generatedByLevelS3Object.getObjectContent();
        ByteArrayOutputStream generatedByLevelS3outputStream = new ByteArrayOutputStream();

        byte[] buffer = new byte[4096];
        int bytesRead;

        while ((bytesRead = generatedByLevelS3inputStream.read(buffer)) != -1) {
            generatedByLevelS3outputStream.write(buffer, 0, bytesRead);
        }
        generatedByLevelS3outputStream.close();
        byte[] generatedByLevelS3byteArray = generatedByLevelS3outputStream.toByteArray();

        // convert byte[] into MultipartFile
        ByteArrayMultipartFile generatedByLevel = new ByteArrayMultipartFile(generatedByLevelS3byteArray, generatedByLevelObjectName);
        return generatedByLevel;
    }

    private ByteArrayMultipartFile getOrigin(Member me) throws IOException {
        String originS3url = me.getFaceInfo().getOriginS3url();
        String originObjectName = originS3url.substring(originS3url.lastIndexOf("/") + 1);
        S3Object originS3Object = amazonS3.getObject(new GetObjectRequest(BUCKET_NAME, originObjectName));

        S3ObjectInputStream originS3inputStream = originS3Object.getObjectContent();
        ByteArrayOutputStream originS3outputStream = new ByteArrayOutputStream();

        byte[] buffer = new byte[4096];
        int bytesRead;

        while ((bytesRead = originS3inputStream.read(buffer)) != -1) {
            originS3outputStream.write(buffer, 0, bytesRead);
        }
        originS3outputStream.close();
        byte[] originS3byteArray = originS3outputStream.toByteArray();

        // convert byte[] into MultipartFile
        ByteArrayMultipartFile origin = new ByteArrayMultipartFile(originS3byteArray, originObjectName);
        return origin;
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND)); // 영속
    }

    private ChatRoomMember findChatRoomMemberByRoomId(Long roomId) {
        return chatRoomMemberRepository.findByChatRoomId(roomId)
                .orElseThrow(() -> new ChatException(NOT_FOUND_CHAT_ROOM_MEMBER)); // 영속
    }
}
