package capstone.facefriend.auth.mail.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.exception.AuthExceptionType;
import capstone.facefriend.auth.mail.controller.dto.MailVerificationResponse;
import capstone.facefriend.auth.mail.service.MailService;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.exception.MemberExceptionType;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static capstone.facefriend.auth.exception.AuthExceptionType.*;
import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;
import static capstone.facefriend.member.exception.MemberExceptionType.*;

@RestController
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;
    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;

    @PostMapping("/mail/send-code")
    public ResponseEntity<String> sendCode(
            @RequestParam("mail") String mail
    ) {
        return ResponseEntity.ok(mailService.sendCode(mail));
    }

    @GetMapping("/mail/verify-code")
    public ResponseEntity<MailVerificationResponse> submitCode(
            @RequestParam("mail") String mail,
            @RequestParam("code") String code,
            HttpServletRequest request
    ) {
        Boolean isVerified = mailService.verifyCode(mail, code);
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED));

        Long memberId = tokenProvider.extractId(accessToken);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        member.setIsVerified(isVerified);

        return ResponseEntity.ok(new MailVerificationResponse(isVerified));
    }
}
