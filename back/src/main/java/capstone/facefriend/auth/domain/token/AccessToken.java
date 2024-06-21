package capstone.facefriend.auth.domain.token;

public record AccessToken(String value) {
    public static AccessToken from(String value) {
        return new AccessToken(value);
    }
}
