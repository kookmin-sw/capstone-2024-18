package capstone.facefriend.member.service;

import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfoRepository;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.service.dto.faceInfo.FaceInfoResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;



@Slf4j
@Service
@RequiredArgsConstructor
public class FaceInfoService {

    @Value("${flask.generate-url}")
    private String requestUrl;
    private final RestTemplate restTemplate;
    private final BucketService bucketService;
    private final MemberRepository memberRepository;
    private final FaceInfoRepository faceInfoRepository;

    @Transactional // origin 삭제 & generated 삭제 -> origin 업로드 & generated 업로드
    public FaceInfoResponse updateOrigin(MultipartFile origin, Long styleId, Long memberId) throws IOException {
        // bucket update
        ByteArrayMultipartFile generated = generate(origin, styleId, memberId);
        List<String> s3urls = bucketService.updateOriginAndGenerated(origin, generated, memberId);

        // entity update
        Member member = findMemberById(memberId); // 영속
        FaceInfo faceInfo = faceInfoRepository.findFaceInfoById(member.getFaceInfo().getId()); // 영속

        String originS3url = s3urls.get(0);
        String generatedS3url = s3urls.get(1);

        faceInfo.setOriginS3url(originS3url); // dirty check
        faceInfo.setGeneratedS3url(generatedS3url); // dirty check

        member.setFaceInfo(faceInfo); // dirty check

        return new FaceInfoResponse(originS3url, generatedS3url);
    }

    public FaceInfoResponse getOriginAndGenerated(Long memberId) {
        Member member = findMemberById(memberId);
        FaceInfo faceInfo = member.getFaceInfo();
        return new FaceInfoResponse(faceInfo.getOriginS3url(), faceInfo.getGeneratedS3url());
    }

    @Transactional // origin 삭제 & generated 삭제
    public FaceInfoResponse deleteOriginAndGenerated(Long memberId) {
        String defaultFaceInfoS3url = bucketService.deleteOriginAndGenerated(memberId);

        Member member = findMemberById(memberId); // 영속
        faceInfoRepository.deleteFaceInfoById(member.getFaceInfo().getId());

        FaceInfo faceInfo = FaceInfo.builder()
                .originS3url(defaultFaceInfoS3url)
                .generatedS3url(defaultFaceInfoS3url)
                .build();
        faceInfo.setOriginS3url(defaultFaceInfoS3url);
        faceInfo.setGeneratedS3url(defaultFaceInfoS3url);
        faceInfoRepository.save(faceInfo);

        member.setFaceInfo(faceInfo); // dirty check

        return new FaceInfoResponse(defaultFaceInfoS3url, defaultFaceInfoS3url);
    }

    private ByteArrayMultipartFile generate(MultipartFile origin, Long styleId, Long memberId) throws IOException {
        // convert MultipartFile into ByteArrayResource
        ByteArrayResource resource = new ByteArrayResource(origin.getBytes()) {
            @Override
            public String getFilename() {
                return URLEncoder.encode(origin.getOriginalFilename(), StandardCharsets.UTF_8);
            }
        };

        // body
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", resource);
        body.add("style_id", styleId);
        body.add("user_id", memberId);

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // request entity
        HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // response entity
        ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(requestUrl, requestEntity, JsonNode.class); // 문제

        // convert JSON into Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> result = objectMapper.convertValue(responseEntity.getBody(), new TypeReference<>() {
        });

        byte[] imageBinary = Base64.getDecoder().decode((String) result.get("image_binary"));

        return new ByteArrayMultipartFile(imageBinary, origin.getOriginalFilename());
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));
    }
}

