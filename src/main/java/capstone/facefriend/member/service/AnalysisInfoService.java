package capstone.facefriend.member.service;


import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.analysis.AnalysisException;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.service.deserializer.StringListDeserializer;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoFullResponse;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoFullShortResponse;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoShortResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static capstone.facefriend.member.exception.analysis.AnalysisExceptionType.FAIL_TO_EXTRACT_FACE_SHAPE_ID_NUM;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;


@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisInfoService {

    @Value("${flask.analyze-url}")
    private String requestUrl;

    private final RestTemplate restTemplate;

    private final MemberRepository memberRepository;


    @Transactional
    public AnalysisInfoFullResponse analyze(MultipartFile origin, Long memberId) throws IOException {
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

        // convert JSON into Map
        ObjectMapper objectMapper = new ObjectMapper();
        AnalysisInfoTotal total = objectMapper.readValue(responseEntity.getBody(), AnalysisInfoTotal.class);

        Map<String, String> analysisFull = extractAnalysisInfoFull(total);
        List<String> analysisShort = extractAnalysisInfoShort(total);
        Integer faceShapeIdNum = extractFaceShapeIdNum(total);

        Member member = findMemberById(memberId); // 영속 상태
        member.getAnalysisInfo().setAnalysisInfoFull(analysisFull); // dirty
        member.getAnalysisInfo().setAnalysisInfoShort(analysisShort);
        member.getAnalysisInfo().setFaceShapeIdNum(faceShapeIdNum);

        return new AnalysisInfoFullResponse(analysisFull);
    }

    private Map<String, String> extractAnalysisInfoFull(AnalysisInfoTotal total) {
        Map<String, String> analysisFull = new HashMap<>();
        analysisFull.put(total.getEye().getName(), total.getEye().getDescription());
        analysisFull.put(total.getFaceShape().getName(), total.getFaceShape().getDescription());
        analysisFull.put(total.getLips().getName(), total.getLips().getDescription());
        analysisFull.put(total.getNose().getName(), total.getNose().getDescription());
        analysisFull.put(total.getEyebrow().getName(), total.getEyebrow().getDescription());

        return analysisFull;
    }

    private Integer extractFaceShapeIdNum(AnalysisInfoTotal total) {
        String idNum = total.getFaceShape().getIdNum();
        if (idNum == null) {
            throw new AnalysisException(FAIL_TO_EXTRACT_FACE_SHAPE_ID_NUM);
        } else {
            return Integer.parseInt(idNum);
        }
    }

    private List<String> extractAnalysisInfoShort(AnalysisInfoTotal total) {
        return Stream.of(
                        total.getEye().getTag(),
                        total.getFaceShape().getTag(),
                        total.getLips().getTag(),
                        total.getNose().getTag(),
                        total.getEyebrow().getTag()
                ).flatMap(List::stream)
                .collect(Collectors.toList());
    }

    public AnalysisInfoFullShortResponse getAnalysisInfoFullShort(Long memberId) {
        Member member = findMemberById(memberId);
        Map<String, String> analysisInfoFull = member.getAnalysisInfo().getAnalysisInfoFull();
        List<String> analysisInfoShort = member.getAnalysisInfo().getAnalysisInfoShort();
        return new AnalysisInfoFullShortResponse(analysisInfoFull, analysisInfoShort);
    }

    public AnalysisInfoFullResponse getAnalysisInfoFull(Long memberId) {
        Member member = findMemberById(memberId);
        return new AnalysisInfoFullResponse(member.getAnalysisInfo().getAnalysisInfoFull());
    }

    public AnalysisInfoShortResponse getAnalysisInfoShort(Long memberId) {
        Member member = findMemberById(memberId);
        return new AnalysisInfoShortResponse(member.getAnalysisInfo().getAnalysisInfoShort());
    }

    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class AnalysisInfoTotal {
        @JsonProperty("face_shape")
        private FaceShape faceShape;
        private Eye eye;
        private Lips lips;
        private Nose nose;
        private Eyebrow eyebrow;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class FaceShape {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Eye {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Lips {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Nose {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Eyebrow {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }
}
