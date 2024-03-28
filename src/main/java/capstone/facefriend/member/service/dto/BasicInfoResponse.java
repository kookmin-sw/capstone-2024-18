package capstone.facefriend.member.service.dto;

import capstone.facefriend.member.domain.BasicInfo;

public record BasicInfoResponse(
    String nickname,
    String gender,
    String ageGroup,
    String ageDegree,
    String heightGroup,
    String region
) {
    public static BasicInfoResponse of(BasicInfo basicInfo) {
        return new BasicInfoResponse(
                basicInfo.getNickname(),
                basicInfo.getGender().getValue(),
                basicInfo.getAgeGroup().getValue(),
                basicInfo.getAgeDegree().getValue(),
                basicInfo.getHeightGroup().getValue(),
                basicInfo.getRegion().getValue()
        );
    }
}
