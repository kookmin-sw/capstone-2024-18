package capstone.facefriend.member.service;

import static capstone.facefriend.member.exception.faceInfo.FaceInfoExceptionType.FAIL_TO_GET_BYTES;

import capstone.facefriend.member.exception.faceInfo.FaceInfoException;
import capstone.facefriend.member.multipartFile.ByteArrayMultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class FaceInfoRequestor {

    @Value("${flask.generate-url}")
    private String GENERATE_IMAGE_REQUEST_URL;

    private final RestTemplate restTemplate;

    public ByteArrayMultipartFile generate(MultipartFile origin, Integer styleId, Long memberId) {
        // convert MultipartFile into ByteArrayResource
        ByteArrayResource resource;
        try {
            resource = new ByteArrayResource(origin.getBytes()) {
                @Override
                public String getFilename() {
                    return URLEncoder.encode(origin.getOriginalFilename(), StandardCharsets.UTF_8);
                }
            };
        } catch (IOException e) {
            throw new FaceInfoException(FAIL_TO_GET_BYTES);
        }

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
        ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(GENERATE_IMAGE_REQUEST_URL, requestEntity,
                JsonNode.class); // 문제

        // convert JSON into Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> result = objectMapper.convertValue(responseEntity.getBody(), new TypeReference<>() {
        });

        byte[] imageBinary = Base64.getDecoder().decode((String) result.get("image_binary"));

        return new ByteArrayMultipartFile(imageBinary, origin.getOriginalFilename());
    }
}
