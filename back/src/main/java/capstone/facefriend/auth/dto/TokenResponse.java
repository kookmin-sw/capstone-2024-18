package capstone.facefriend.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {

}
