package capstone.facefriend.member.dto.basicInfo;

public record BasicInfoRequest(
        String nickname,
        String gender,
        String ageGroup,
        String ageDegree,
        String heightGroup,
        String region
) {

}
