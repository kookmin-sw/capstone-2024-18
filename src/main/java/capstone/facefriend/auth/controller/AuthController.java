package capstone.facefriend.auth.controller;


import capstone.facefriend.auth.dto.LoginUriResponse;
import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.domain.oauth.OAuthMember;
import capstone.facefriend.auth.service.AuthService;
import capstone.facefriend.auth.service.OAuthRequester;
import capstone.facefriend.auth.dto.OAuthLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuthRequester oAuthRequester;

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/oauth/{provider}/login-uri")
    public ResponseEntity<LoginUriResponse> loginUri(
            @PathVariable String provider,
            @RequestParam("redirect-uri") String redirectUri
    ) {
        String loginUri = authService.loginUri(redirectUri, provider);
        return ResponseEntity.ok(new LoginUriResponse(loginUri));
    }

    @PostMapping("/oauth/{provider}/login")
    public ResponseEntity login(
            @RequestBody OAuthLoginRequest request,
            @PathVariable String provider
    ) {
        OAuthMember oAuthMember = oAuthRequester.login(request, provider);
        TokenResponse tokens = authService.generateTokens(oAuthMember);
        return ResponseEntity.ok(tokens);
    }
}
