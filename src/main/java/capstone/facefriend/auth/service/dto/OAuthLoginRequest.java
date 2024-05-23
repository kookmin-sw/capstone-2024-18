package capstone.facefriend.auth.service.dto;

public record OAuthLoginRequest(
        String redirectUri,
        String code
) {
}
