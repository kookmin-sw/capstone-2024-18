package capstone.facefriend.member.controller;

import static capstone.facefriend.member.exception.member.MemberExceptionType.PASSWORDS_NOT_EQUAL;
import static capstone.facefriend.member.exception.member.MemberExceptionType.UNAUTHORIZED;

import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.auth.support.AuthenticationExtractor;
import capstone.facefriend.email.controller.dto.EmailVerificationResponse;
import capstone.facefriend.member.dto.member.FindEmailResponse;
import capstone.facefriend.member.dto.member.ReissueRequest;
import capstone.facefriend.member.dto.member.ResetPasswordRequest;
import capstone.facefriend.member.dto.member.SignInRequest;
import capstone.facefriend.member.dto.member.SignUpRequest;
import capstone.facefriend.member.dto.member.SignupResponse;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/member/find-email")
    public ResponseEntity<FindEmailResponse> findEmail(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.findEmail(email));
    }

    @PostMapping("/member/send-temporary-password")
    public ResponseEntity<String> sendTemporaryPassword(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.sendTemporaryPassword(email));
    }

    @PostMapping("/member/verify-temporary-password")
    public ResponseEntity<String> verifyTemporaryPassword(
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

    @PostMapping("/member/reset-password")
    public ResponseEntity<String> resetPassword(
            @AuthMember Long memberId,
            @RequestBody ResetPasswordRequest request
    ) {
        String newPassword = request.newPassword();
        String newPassword2 = request.newPassword2();

        if (!newPassword.equals(newPassword2)) {
            throw new MemberException(PASSWORDS_NOT_EQUAL);
        }

        return ResponseEntity.ok(memberService.resetPassword(memberId, newPassword));
    }

    @PostMapping("/member/verify-duplication")
    public ResponseEntity<String> verifyDuplication(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.verifyDuplication(email));
    }

    @PostMapping("/member/send-code")
    public ResponseEntity<String> sendCode(
            @RequestParam("email") String email
    ) {
        return ResponseEntity.ok(memberService.sendCode(email));
    }

    @GetMapping("/member/verify-code")
    public ResponseEntity<EmailVerificationResponse> verifyCode(
            @RequestParam("email") String email,
            @RequestParam("code") String code
    ) {
        return ResponseEntity.ok(memberService.verifyCode(email, code));
    }

    @PostMapping("/member/signup")
    public ResponseEntity<SignupResponse> signUp(
            @RequestBody SignUpRequest request
    ) {
        return ResponseEntity.ok(memberService.signUp(request));
    }

    @PostMapping("/member/signin")
    public ResponseEntity<TokenResponse> signIn(
            @RequestBody SignInRequest request
    ) {
        return ResponseEntity.ok(memberService.signIn(request));
    }

    @DeleteMapping("/member/sign-out")
    public ResponseEntity<String> signOut(
            HttpServletRequest request,
            @AuthMember Long memberId
    ) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new MemberException(UNAUTHORIZED));
        return ResponseEntity.ok(memberService.signOut(memberId, accessToken));
    }

    @PostMapping("/member/reissue")
    public ResponseEntity<TokenResponse> reissueTokens(
            @RequestBody ReissueRequest request,
            @AuthMember Long memberId
    ) {
        String refreshToken = request.refreshToken();
        return ResponseEntity.ok(memberService.reissueTokens(memberId, refreshToken));
    }
}
