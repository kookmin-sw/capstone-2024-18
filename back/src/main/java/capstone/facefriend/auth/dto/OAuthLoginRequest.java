package capstone.facefriend.auth.dto;

public record OAuthLoginRequest(
        String redirectUri,
        String code
) {
}
