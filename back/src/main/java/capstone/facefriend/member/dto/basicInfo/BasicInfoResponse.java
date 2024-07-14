package capstone.facefriend.member.dto.basicInfo;

import static capstone.facefriend.member.domain.basicInfo.BasicInfo.AgeDegree;
import static capstone.facefriend.member.domain.basicInfo.BasicInfo.AgeGroup;
import static capstone.facefriend.member.domain.basicInfo.BasicInfo.Gender;
import static capstone.facefriend.member.domain.basicInfo.BasicInfo.HeightGroup;
import static capstone.facefriend.member.domain.basicInfo.BasicInfo.Region;

import capstone.facefriend.member.domain.basicInfo.BasicInfo;

public record BasicInfoResponse(
        String nickname,
        Gender gender,
        AgeGroup ageGroup,
        AgeDegree ageDegree,
        HeightGroup heightGroup,
        Region region
) {

    public static BasicInfoResponse of(BasicInfo basicInfo) {
        return new BasicInfoResponse(
                basicInfo.getNickname(),
                basicInfo.getGender(),
                basicInfo.getAgeGroup(),
                basicInfo.getAgeDegree(),
                basicInfo.getHeightGroup(),
                basicInfo.getRegion()
        );
    }
}
