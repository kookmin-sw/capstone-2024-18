package capstone.facefriend.auth.controller;


import capstone.facefriend.auth.controller.dto.LoginUriResponse;
import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.OAuthMember;
import capstone.facefriend.auth.infrastructure.dto.OAuthTokenResponse;
import capstone.facefriend.auth.service.AuthService;
import capstone.facefriend.auth.service.OAuthRequester;
import capstone.facefriend.auth.service.dto.OAuthLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuthRequester oAuthRequester;

    @GetMapping("/oauth/{provider}/login-uri")
    public ResponseEntity<LoginUriResponse> loginUri(
            @PathVariable String provider,
            @RequestParam("redirect-uri") String redirectUri
    ) {
        String loginUri = authService.loginUri(redirectUri, provider);
        return ResponseEntity.ok(new LoginUriResponse(loginUri));
    }

    @PostMapping("/oauth/{provider}/accessToken")
    public ResponseEntity<OAuthTokenResponse> accessToken(
            @RequestBody OAuthLoginRequest request,
            @PathVariable String provider
    ) {
        return ResponseEntity.ok(oAuthRequester.accessToken(request, provider));
    }

    @PostMapping("/oauth/{provider}/login")
    public ResponseEntity<TokenResponse> login(
            @RequestBody OAuthLoginRequest request,
            @PathVariable String provider
    ) {
        OAuthMember oAuthMember = oAuthRequester.login(request, provider);
        String token = authService.generateToken(oAuthMember);
        return ResponseEntity.ok(new TokenResponse(token));
    }
}
