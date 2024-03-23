package capstone.facefriend.member.controller;


import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.email.controller.dto.EmailVerificationResponse;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.service.MemberService;
import capstone.facefriend.member.service.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static capstone.facefriend.member.exception.MemberExceptionType.UNAUTHORIZED;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/members/send-code")
    public ResponseEntity<String> sendCode(
            @RequestParam("email") String email) {
        return ResponseEntity.ok(memberService.sendCode(email));
    }

    @GetMapping("/members/verify-code")
    public ResponseEntity<EmailVerificationResponse> verifyCode(
            @RequestParam("email") String email,
            @RequestParam("code") String code) {
        return ResponseEntity.ok(memberService.verifyCode(email, code));
    }

    // 일반 유저 인증 인가
    @PostMapping("/members/signup")
    public ResponseEntity<String> signUp(
            @RequestBody SignUpRequest request,
            @RequestParam("isVerified") boolean isVerified) {
        return ResponseEntity.ok(memberService.signUp(request, isVerified));
    }

    // 일반 유저 인증 인가
    @PostMapping("/members/signin")
    public ResponseEntity<TokenResponse> signIn(
            @RequestBody SignInRequest request) {
        return ResponseEntity.ok(memberService.signIn(request));
    }

    // 구글 유저, 일반 유저 공통 로직
    @PostMapping("/reissue")
    public ResponseEntity<TokenResponse> reissueTokens(
            @RequestBody ReissueRequest request,
            @AuthMember Long memberId) {
        String refreshToken = request.refreshToken();
        return ResponseEntity.ok(memberService.reissueTokens(memberId, refreshToken));
    }

    // 구글 유저, 일반 유저 공통 로직
    @DeleteMapping("/signout")
    public ResponseEntity<String> signOut(
            HttpServletRequest request,
            @AuthMember Long memberId) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new MemberException(UNAUTHORIZED));
        return ResponseEntity.ok(memberService.signOut(memberId, accessToken));
    }

    @PostMapping("/find-email")
    public ResponseEntity<FindEmailResponse> findMail(
            @RequestBody FindEmailRequest request,
            @AuthMember Long memberId) {
        String name = request.name();
        String email = request.email();
        return ResponseEntity.ok(memberService.findEmail(name, email, memberId));
    }

    // 구글 유저, 일반 유저 공통 로직 (테스트용)
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("[ MemberController ] 테스트");
    }
}
