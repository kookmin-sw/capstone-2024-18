package capstone.facefriend.member.service.dto;

public record ReissueRequest(
    String accessToken,
    String refreshToken
) {
}
