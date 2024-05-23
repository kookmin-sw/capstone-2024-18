package capstone.facefriend.auth.controller.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        Long memberId
) {
}
