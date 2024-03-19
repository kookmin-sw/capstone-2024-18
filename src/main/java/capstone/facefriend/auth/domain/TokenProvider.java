package capstone.facefriend.auth.domain;

import capstone.facefriend.auth.controller.dto.TokenResponse;

public interface TokenProvider {

    TokenResponse createTokens(Long id);
    String createAccessToken(Long id);
    String createRefreshToken(Long id);

    Long extractId(String token);

    boolean validateExpiration(String token);
    boolean validateIntegrity(String token);
}
