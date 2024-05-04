package capstone.facefriend.member.service;


import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.domain.member.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.service.dto.basicInfo.BasicInfoRequest;
import capstone.facefriend.member.service.dto.basicInfo.BasicInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.member.domain.basicInfo.BasicInfo.*;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;


@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class BasicInfoService {

    private final MemberRepository memberRepository;

    public BasicInfoResponse getBasicInfo(Long memberId) {
        Member member = findMemberById(memberId);
        BasicInfo basicInfo = member.getBasicInfo();

        return BasicInfoResponse.of(basicInfo);
    }

    @Transactional
    public BasicInfoResponse putBasicInfo(Long memberId, BasicInfoRequest request) {
        Member member = findMemberById(memberId); // 영속
        BasicInfo oldBasicInfo = member.getBasicInfo(); // 영속

        oldBasicInfo.setNickname(request.nickname()); // dirty check
        oldBasicInfo.setGender(Gender.valueOf(request.gender())); // dirty check
        oldBasicInfo.setAgeGroup(AgeGroup.valueOf(request.ageGroup())); // dirty check
        oldBasicInfo.setAgeDegree(AgeDegree.valueOf(request.ageDegree())); // dirty check
        oldBasicInfo.setHeightGroup(HeightGroup.valueOf(request.heightGroup())); // dirty check
        oldBasicInfo.setRegion(Region.valueOf(request.region())); // dirty check

        member.setBasicInfo(oldBasicInfo);


        return BasicInfoResponse.of(oldBasicInfo);
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));
    }
}
