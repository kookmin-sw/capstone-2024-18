package capstone.facefriend.oauth.dto;

public record OAuthLoginRequest(
        String redirectUri,
        String code
) {

}
