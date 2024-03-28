package capstone.facefriend.member.service.dto;

public record BasicInfoRequest(
    String nickname,
    String gender,
    String ageGroup,
    String ageDegree,
    String heightGroup,
    String region
) {
}
