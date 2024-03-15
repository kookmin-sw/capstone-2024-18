package capstone.facefriend.auth.service;

import capstone.facefriend.auth.domain.OAuthMember;
import capstone.facefriend.auth.domain.Provider;
import capstone.facefriend.auth.infrastructure.dto.OAuthTokenResponse;
import capstone.facefriend.auth.service.dto.OAuthLoginRequest;

public interface OAuthRequester {

    String loginUri(Provider provider, String redirectUri);

    OAuthTokenResponse accessToken(OAuthLoginRequest request, String provider);

    OAuthMember login(OAuthLoginRequest request, String provider);
}
