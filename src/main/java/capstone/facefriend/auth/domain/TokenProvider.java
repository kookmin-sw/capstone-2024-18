package capstone.facefriend.auth.domain;

public interface TokenProvider {

    String createAccessToken(Long id);
    String createRefreshToken(Long id);

    Long extractId(String token);

    boolean validateExpiration(String token);
    boolean validateIntegrity(String token);
}
