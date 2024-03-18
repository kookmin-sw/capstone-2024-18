package capstone.facefriend.auth.domain;

public interface TokenProvider {

    String createAccessToken(Long id);

    String createRefreshToken(Long id);

    Long extractId(String token);

    Boolean validateExpiration(String token);

    Boolean validateIntegrity(String token);
}
