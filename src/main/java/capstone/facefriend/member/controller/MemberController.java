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

import static capstone.facefriend.member.exception.MemberExceptionType.PASSWORDS_NOT_EQUAL;
import static capstone.facefriend.member.exception.MemberExceptionType.UNAUTHORIZED;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 일반 유저 로직 ("/auth" 로 시작)
    @PostMapping("/auth/find-email")
    public ResponseEntity<FindEmailResponse> findEmail(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.findEmail(email));
    }

    @PostMapping("/auth/send-temporary-password")
    public ResponseEntity<String> sendTemporaryPassword(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.sendTemporaryPassword(email));
    }

    @PostMapping("/auth/verify-temporary-password")
    public ResponseEntity<String> resetNewPassword(
            @RequestParam("email") String email,
            @RequestParam("temporaryPassword") String temporaryPassword,
            @RequestBody ResetPasswordRequest request
    ) {
        String newPassword = request.newPassword();
        String newPassword2 = request.newPassword2();

        if (!newPassword.equals(newPassword2)) {
            throw new MemberException(PASSWORDS_NOT_EQUAL);
        }
        return ResponseEntity.ok(memberService.verifyTemporaryPassword(email, temporaryPassword, newPassword));
    }

    @PostMapping("/auth/verify-duplication")
    public ResponseEntity<String> verifyDuplication(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.verifyDuplication(email));
    }

    @PostMapping("/auth/send-code")
    public ResponseEntity<String> sendCode(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.sendCode(email));
    }

    @GetMapping("/auth/verify-code")
    public ResponseEntity<EmailVerificationResponse> verifyCode(
            @RequestParam("email") String email,
            @RequestParam("code") String code
    ) {
        return ResponseEntity.ok(memberService.verifyCode(email, code));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<String> signUp(
            @RequestBody SignUpRequest request
    ) {
        return ResponseEntity.ok(memberService.signUp(request));
    }

    @PostMapping("/auth/signin")
    public ResponseEntity<TokenResponse> signIn(
            @RequestBody SignInRequest request
    ) {
        return ResponseEntity.ok(memberService.signIn(request));
    }



    // 구글 유저, 일반 유저 공통 로직 ("/members" 로 시작)
    @DeleteMapping("/members/signout")
    public ResponseEntity<String> signOut(
            HttpServletRequest request,
            @AuthMember Long memberId
    ) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new MemberException(UNAUTHORIZED));
        return ResponseEntity.ok(memberService.signOut(memberId, accessToken));
    }

    @PostMapping("/members/reissue")
    public ResponseEntity<TokenResponse> reissueTokens(
            @RequestBody ReissueRequest request,
            @AuthMember Long memberId
    ) {
        String refreshToken = request.refreshToken();
        return ResponseEntity.ok(memberService.reissueTokens(memberId, refreshToken));
    }





    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("[ MemberController ] 테스트");
    }
}
