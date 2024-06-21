package capstone.facefriend.auth.service;

import capstone.facefriend.auth.domain.oauth.OAuthMember;
import capstone.facefriend.auth.domain.oauth.Provider;
import capstone.facefriend.auth.dto.OAuthLoginRequest;

public interface OAuthRequester {

    String loginUri(Provider provider, String redirectUri);

    OAuthMember login(OAuthLoginRequest request, String provider);
}
