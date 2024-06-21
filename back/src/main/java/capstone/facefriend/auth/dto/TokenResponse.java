package capstone.facefriend.auth.dto;

import capstone.facefriend.auth.domain.token.AccessToken;
import capstone.facefriend.auth.domain.token.RefreshToken;

public record TokenResponse(
        AccessToken accessToken,
        RefreshToken refreshToken,
        Long memberId
) {
}
