package capstone.facefriend.oauth.requestor;

import capstone.facefriend.oauth.domain.OAuthMember;
import capstone.facefriend.oauth.domain.Provider;
import capstone.facefriend.oauth.dto.OAuthLoginRequest;

public interface OAuthRequester {

    String loginUri(Provider provider, String redirectUri);

    OAuthMember login(OAuthLoginRequest request, String provider);
}
