package capstone.facefriend.member.controller;


import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.service.MemberService;
import capstone.facefriend.member.service.dto.SignInRequest;
import capstone.facefriend.member.service.dto.SignUpRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static capstone.facefriend.member.exception.MemberExceptionType.UNAUTHORIZED;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/members/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(memberService.signUp(request));
    }

    @PostMapping("/members/signin")
    public ResponseEntity<TokenResponse> signIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(memberService.signIn(request));
    }

    @GetMapping("/members/reissue")
    public ResponseEntity<TokenResponse> reissueTokens(@AuthMember Long memberId) {
        return ResponseEntity.ok(memberService.generateTokens(memberId));
    }

    @DeleteMapping("/members/signout")
    public ResponseEntity<String> signOut(HttpServletRequest request, @AuthMember Long memberId) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new MemberException(UNAUTHORIZED));
        return ResponseEntity.ok(memberService.signOut(memberId, accessToken));
    }

    @GetMapping("/members/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("[ MemberController ] 과연?");
    }
}
