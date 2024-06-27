package capstone.facefriend.member.service;


import capstone.facefriend.common.aop.TimeTrace;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoFullResponse;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoFullShortResponse;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoShortResponse;
import capstone.facefriend.member.exception.analysis.AnalysisInfoException;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.service.deserializer.StringListDeserializer;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static capstone.facefriend.member.exception.analysis.AnalysisInfoExceptionType.FAIL_TO_EXTRACT_FACE_SHAPE_ID_NUM;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;


@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisInfoService {

    private final MemberRepository memberRepository;

    @TimeTrace
    @Transactional
    public AnalysisInfoFullShortResponse bindAnalysisInfoTotal(AnalysisInfoTotal total, Long memberId) {

        Map<String, String> analysisFull = extractAnalysisInfoFull(total);
        List<String> analysisShort = extractAnalysisInfoShort(total);
        Integer faceShapeIdNum = extractFaceShapeIdNum(total);

        Member member = findMemberById(memberId);
        member.getAnalysisInfo().setAnalysisFull(analysisFull);
        member.getAnalysisInfo().setAnalysisShort(analysisShort);
        member.getAnalysisInfo().setFaceShapeIdNum(faceShapeIdNum);

        return new AnalysisInfoFullShortResponse(analysisFull, analysisShort);
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
            throw new AnalysisInfoException(FAIL_TO_EXTRACT_FACE_SHAPE_ID_NUM);
        }

        return Integer.parseInt(idNum);
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

        Map<String, String> analysisInfoFull = member.getAnalysisInfo().getAnalysisFull();
        List<String> analysisInfoShort = member.getAnalysisInfo().getAnalysisShort();

        return new AnalysisInfoFullShortResponse(analysisInfoFull, analysisInfoShort);
    }

    public AnalysisInfoFullResponse getAnalysisInfoFull(Long memberId) {
        Member member = findMemberById(memberId);
        return new AnalysisInfoFullResponse(member.getAnalysisInfo().getAnalysisFull());
    }

    public AnalysisInfoShortResponse getAnalysisInfoShort(Long memberId) {
        Member member = findMemberById(memberId);
        return new AnalysisInfoShortResponse(member.getAnalysisInfo().getAnalysisShort());
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }

    @Getter
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
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    private static class FaceShape {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    private static class Eye {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    private static class Lips {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    private static class Nose {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    private static class Eyebrow {
        private String name;
        private String description;
        @JsonDeserialize(using = StringListDeserializer.class)
        private List<String> tag;
        @JsonProperty("id_num")
        private String idNum;
    }
}
