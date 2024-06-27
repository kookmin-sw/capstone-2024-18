package capstone.facefriend.member.service;

import capstone.facefriend.common.aop.TimeTrace;
import capstone.facefriend.member.exception.analysis.AnalysisInfoException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static capstone.facefriend.member.exception.analysis.AnalysisInfoExceptionType.*;
import static capstone.facefriend.member.service.AnalysisInfoService.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisInfoRequestor {

    @Value("${flask.analyze-url}")
    private String requestUrl;

    private final RestTemplate restTemplate;

    @TimeTrace
    public AnalysisInfoTotal analyze(MultipartFile origin, Long memberId) {

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
            throw new AnalysisInfoException(FAIL_TO_GET_BYTES);
        }

        // body
        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", resource);
        body.add("user_id", memberId);

        // header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // request entity
        HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        // response entity
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                requestUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        // map JSON into AnalysisInfoTotal
        ObjectMapper objectMapper = new ObjectMapper();
        AnalysisInfoTotal analysisInfoTotal;
        try {
            analysisInfoTotal = objectMapper.readValue(responseEntity.getBody(), AnalysisInfoTotal.class);
        } catch (JsonProcessingException e) {
            throw new AnalysisInfoException(FAIL_TO_GET_RESPONSE_BODY);
        }

        return analysisInfoTotal;
    }
}
