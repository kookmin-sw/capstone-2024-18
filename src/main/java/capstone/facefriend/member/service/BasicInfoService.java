package capstone.facefriend.member.service;


import capstone.facefriend.member.domain.BasicInfo;
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

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
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
        BasicInfo oldBasicInfo = member.getBasicInfo();

        oldBasicInfo.setNickname(request.nickname());
        oldBasicInfo.setGender(Gender.valueOf(request.gender()));
        oldBasicInfo.setAgeGroup(AgeGroup.valueOf(request.ageGroup()));
        oldBasicInfo.setAgeDegree(AgeDegree.valueOf(request.ageDegree()));
        oldBasicInfo.setHeightGroup(HeightGroup.valueOf(request.heightGroup()));
        oldBasicInfo.setRegion(Region.valueOf(request.region()));

        member.setBasicInfo(oldBasicInfo);

        memberRepository.save(member);

        return BasicInfoResponse.of(oldBasicInfo);
    }
}
