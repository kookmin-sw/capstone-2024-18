package capstone.facefriend.member.service;


import capstone.facefriend.member.domain.BasicInfo;
import capstone.facefriend.member.domain.BasicInfoRepository;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.service.dto.BasicInfoRequest;
import capstone.facefriend.member.service.dto.BasicInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.member.domain.BasicInfo.*;
import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;

@Service
@Slf4j
@RequiredArgsConstructor
public class BasicInfoService {

    private final MemberRepository memberRepository;
    private final BasicInfoRepository basicInfoRepository;

    private final String BASIC_INFO_SUCCESS_MESSAGE = "기본 정보 저장이 완료되었습니다.";


    private Member findMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
        return member;
    }

    @Transactional
    public BasicInfoResponse setBasicInfo(
            Long memberId, BasicInfoRequest request
    ) {
        Member member = findMemberById(memberId);
        BasicInfo basicInfo = builder()
                .nickname(request.nickname())
                .gender(Gender.valueOf(request.gender()))
                .ageGroup(AgeGroup.valueOf(request.ageGroup()))
                .ageDegree(AgeDegree.valueOf(request.ageDegree()))
                .heightGroup(HeightGroup.valueOf(request.heightGroup()))
                .region(Region.valueOf(request.region()))
                .build();
        basicInfoRepository.save(basicInfo);
        member.setBasicInfo(basicInfo);
        memberRepository.save(member);

        return BasicInfoResponse.of(basicInfo);
    }

    @Transactional
    public BasicInfoResponse getBasicInfo(Long memberId) {
        Member member = findMemberById(memberId);
        BasicInfo basicInfo = member.getBasicInfo();

        return BasicInfoResponse.of(basicInfo);
    }

    @Transactional
    public BasicInfoResponse putBasicInfo(Long memberId, BasicInfoRequest request) {
        Member member = findMemberById(memberId);
        BasicInfo basicInfo = builder()
                .nickname(request.nickname())
                .gender(Gender.valueOf(request.gender()))
                .ageGroup(AgeGroup.valueOf(request.ageGroup()))
                .ageDegree(AgeDegree.valueOf(request.ageDegree()))
                .heightGroup(HeightGroup.valueOf(request.heightGroup()))
                .region(Region.valueOf(request.region()))
                .build();

        basicInfoRepository.save(basicInfo);
        member.setBasicInfo(basicInfo);
        basicInfoRepository.save(basicInfo);

        return BasicInfoResponse.of(basicInfo);
    }
}
