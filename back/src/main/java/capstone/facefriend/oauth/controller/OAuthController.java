package capstone.facefriend.oauth.controller;


import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.oauth.domain.OAuthMember;
import capstone.facefriend.oauth.dto.OAuthLoginRequest;
import capstone.facefriend.oauth.dto.OAuthLoginUriResponse;
import capstone.facefriend.oauth.requestor.OAuthRequester;
import capstone.facefriend.oauth.service.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;
    private final OAuthRequester oAuthRequester;

    @GetMapping("/oauth/{provider}/login-uri")
    public ResponseEntity<OAuthLoginUriResponse> loginUri(
            @PathVariable String provider,
            @RequestParam("redirect-uri") String redirectUri
    ) {
        String loginUri = oAuthService.loginUri(redirectUri, provider);
        return ResponseEntity.ok(new OAuthLoginUriResponse(loginUri));
    }

    @PostMapping("/oauth/{provider}/login")
    public ResponseEntity<TokenResponse> login(
            @PathVariable String provider,
            @RequestBody OAuthLoginRequest request
    ) {
        OAuthMember oAuthMember = oAuthRequester.login(request, provider);
        TokenResponse tokenResponse = oAuthService.generateTokens(oAuthMember);
        return ResponseEntity.ok(tokenResponse);
    }
}
