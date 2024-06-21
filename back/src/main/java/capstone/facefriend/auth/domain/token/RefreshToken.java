package capstone.facefriend.auth.domain.token;

public record RefreshToken(String value) {
    public static RefreshToken from(String value) {
        return new RefreshToken(value);
    }
}
