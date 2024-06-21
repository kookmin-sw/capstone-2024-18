package capstone.facefriend.auth.domain.token;

import capstone.facefriend.auth.dto.TokenResponse;

public interface TokenProvider {

    TokenResponse createTokens(Long id);
    String createAccessToken(Long id);
    String createRefreshToken(Long id);

    Long extractId(String token);
    Long extractIdIgnoringExpiration(String token);
}
