package capstone.facefriend.member.service;

import capstone.facefriend.member.domain.FaceInfo;
import capstone.facefriend.member.domain.FaceInfoRepository;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.exception.MemberExceptionType;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import capstone.facefriend.member.service.dto.FaceInfoResponse;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class FaceInfoService {

    @Value("${flask.generate-url}")
    private String requestUrl;

    @Value("${spring.cloud.aws.s3.default-profile}")
    private String defaultProfileS3Url;

    private final RestTemplate restTemplate;

    private final BucketService bucketService;

    private final FaceInfoRepository faceInfoRepository;
    private final MemberRepository memberRepository;

    // origin 업로드 & generated 업로드
    public FaceInfoResponse uploadOrigin(MultipartFile origin, Long styleId, Long memberId) throws IOException {
        ByteArrayMultipartFile generated = generate(origin, styleId, memberId);
        return bucketService.uploadOriginAndGenerated(origin, generated, memberId);
    }

    // origin 삭제 & generated 삭제 -> origin 업로드 & generated 업로드
    public FaceInfoResponse updateOrigin(MultipartFile origin, Long styleId, Long memberId) throws IOException {
        ByteArrayMultipartFile generated = generate(origin, styleId, memberId);
        return bucketService.updateOriginAndGenerated(origin, generated, memberId);
    }

    public FaceInfoResponse getOriginAndGenerated(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));

        FaceInfo faceInfo = member.getFaceInfo();
        return new FaceInfoResponse(faceInfo.getOriginS3Url(), faceInfo.getGeneratedS3url());
    }

    // origin 삭제 & generated 삭제
    public FaceInfoResponse deleteOriginAndGenerated(Long memberId) {
        FaceInfoResponse delete = bucketService.deleteOriginAndGenerated(memberId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND));

        FaceInfo faceInfo = member.getFaceInfo();
        faceInfo.setOriginS3Url(defaultProfileS3Url);
        faceInfo.setGeneratedS3Url(defaultProfileS3Url);
        faceInfoRepository.save(faceInfo);

        member.setFaceInfo(faceInfo);
        memberRepository.save(member);

        return delete;
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
        ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(requestUrl, requestEntity, JsonNode.class);

        // convert JSON into Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> result = objectMapper.convertValue(responseEntity.getBody(), new TypeReference<>() {});

        byte[] imageBinary = Base64.getDecoder().decode((String)result.get("image_binary"));

        return new ByteArrayMultipartFile(imageBinary, origin.getOriginalFilename());
    }
}

