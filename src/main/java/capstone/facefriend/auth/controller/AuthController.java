package capstone.facefriend.auth.controller;


import capstone.facefriend.auth.controller.dto.CodeResponse;
import capstone.facefriend.auth.controller.dto.LoginUriResponse;
import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.OAuthMember;
import capstone.facefriend.auth.service.AuthService;
import capstone.facefriend.auth.service.OAuthRequester;
import capstone.facefriend.auth.service.dto.OAuthLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


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

    @GetMapping("/")
    public ResponseEntity<CodeResponse> loginUri(
            @RequestParam("code") String code,
            @RequestParam("scope") String scope,
            @RequestParam("authuser") String authuser,
            @RequestParam("prompt") String prompt
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("facefriend://"));
        return ResponseEntity
                .status(HttpStatus.MOVED_PERMANENTLY)
                .headers(headers)
                .body(new CodeResponse(code));
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
