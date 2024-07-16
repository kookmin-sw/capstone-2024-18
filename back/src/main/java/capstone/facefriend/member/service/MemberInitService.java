package capstone.facefriend.member.service;

import static capstone.facefriend.member.domain.member.Role.USER;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo.AgeDegree;
import capstone.facefriend.member.domain.basicInfo.BasicInfo.AgeGroup;
import capstone.facefriend.member.domain.basicInfo.BasicInfo.Gender;
import capstone.facefriend.member.domain.basicInfo.BasicInfo.HeightGroup;
import capstone.facefriend.member.domain.basicInfo.BasicInfo.Region;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.dto.member.SignUpRequest;
import capstone.facefriend.member.repository.AnalysisInfoRepository;
import capstone.facefriend.member.repository.BasicInfoRepository;
import capstone.facefriend.member.repository.FaceInfoRepository;
import capstone.facefriend.member.repository.MemberRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberInitService {

    private final BasicInfoRepository basicInfoRepository;
    private final FaceInfoRepository faceInfoRepository;
    private final AnalysisInfoRepository analysisInfoRepository;
    private final MemberRepository memberRepository;

    private static final String EYE = "눈";
    private static final String FACE_SHAPE = "얼굴형";
    private static final String LIPS = "입술";
    private static final String NOSE = "코";
    private static final String EYEBROW = "눈썹";
    private static final String DESCRIPTION = "관상 분석 설명이 없습니다!";
    private static final String TAG = "관상 분석 태그가 없습니다!";
    private static final Integer FACE_SHAPE_ID_NUM = -1;

    @Value("${cloud.aws.s3.default-profile}")
    private String defaultFaceInfoS3url;

    public BasicInfo initBasicInfo() {
        BasicInfo basicInfo = BasicInfo.builder()
                .nickname("")
                .gender(Gender.DEFAULT)
                .ageGroup(AgeGroup.DEFAULT)
                .ageDegree(AgeDegree.DEFAULT)
                .heightGroup(HeightGroup.DEFAULT)
                .region(Region.DEFAULT)
                .build();
        return basicInfoRepository.save(basicInfo);
    }

    public FaceInfo initFaceInfo() {
        FaceInfo faceInfo = FaceInfo.builder()
                .originS3url(defaultFaceInfoS3url)
                .generatedS3url(defaultFaceInfoS3url)
                .build();
        return faceInfoRepository.save(faceInfo);
    }

    public AnalysisInfo initAnalysisInfo() {
        AnalysisInfo analysisInfo = AnalysisInfo.builder()
                .analysisFull(Map.of(EYE, DESCRIPTION,
                        FACE_SHAPE, DESCRIPTION,
                        LIPS, DESCRIPTION,
                        NOSE, DESCRIPTION,
                        EYEBROW, DESCRIPTION))
                .analysisShort(List.of(TAG))
                .faceShapeIdNum(FACE_SHAPE_ID_NUM)
                .build();
        return analysisInfoRepository.save(analysisInfo);
    }

    public Member initMember(
            SignUpRequest request,
            String encodedPassword,
            BasicInfo basicInfo,
            FaceInfo faceInfo,
            AnalysisInfo analysisInfo
    ) {
        Member member = Member.builder()
                .email(request.email())
                .password(encodedPassword)
                .role(USER)
                .basicInfo(basicInfo) // 기본정보
                .faceInfo(faceInfo) // 관상 이미지
                .analysisInfo(analysisInfo) // 관상 분석
                .build();
        return memberRepository.save(member);
    }
}
