package capstone.facefriend.member.service;

import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.email.controller.dto.EmailVerificationResponse;
import capstone.facefriend.email.service.EmailService;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.service.dto.FindEmailResponse;
import capstone.facefriend.member.service.dto.SignInRequest;
import capstone.facefriend.member.service.dto.SignUpRequest;
import capstone.facefriend.redis.RedisDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.member.domain.Role.USER;
import static capstone.facefriend.member.exception.MemberExceptionType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final RedisDao redisDao;

    private static final String SIGN_UP_VALID_EMAIL = "사용 가능한 이메일입니다.";
    private static final String SIGN_UP_SUCCESS_MESSAGE = "회원가입 성공";
    private static final String SIGN_OUT_SUCCESS_MESSAGE = "로그아웃 성공";
    private static final String RESET_PASSWORD_SUCCESS_MESSAGE = "비밀번호 재설정 성공";
    private static final Long SIGN_OUT_MINUTE = 1000 * 60 * 60 * 12L; // 12 시간

    @Transactional
    public String verifyDuplication(String email) {
        if(memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(DUPLICATED_EMAIL);
        }
        return SIGN_UP_VALID_EMAIL;
    }

    @Transactional
    public String sendCode(String email) {
        if (memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(DUPLICATED_EMAIL);
        }
        return emailService.sendCode(email);
    }

    @Transactional
    public EmailVerificationResponse verifyCode(String email, String code) {
        boolean isVerified = emailService.verifyCode(email, code);

        if (isVerified) {
            return new EmailVerificationResponse(email, true);
        }
        return new EmailVerificationResponse(email, false);
    }

    @Transactional
    public String signUp(SignUpRequest request, boolean isVerified) {
        if (isVerified) {
            String encodedPassword = passwordEncoder.encode(request.password());
            Member member = Member.builder()
                    .email(request.email())
                    .password(encodedPassword)
                    .name(request.name())
                    .isVerified(true)
                    .role(USER)
                    .build();
            memberRepository.save(member);
        } else {
            throw new MemberException(NOT_VERIFIED);
        }
        return SIGN_UP_SUCCESS_MESSAGE;
    }

    @Transactional
    public TokenResponse signIn(SignInRequest request) {
        String email = request.email();
        String password = request.password();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new MemberException(WRONG_PASSWORD);
        }
        return tokenProvider.createTokens(member.getId());
    }


    @Transactional
    public String signOut(Long memberId, String accessToken) {
        redisDao.deleteRefreshToken(String.valueOf(memberId));
        redisDao.setAccessTokenSignOut(accessToken, SIGN_OUT_MINUTE);
        return SIGN_OUT_SUCCESS_MESSAGE;
    }

    public TokenResponse reissueTokens(Long memberId, String refreshTokenInput) {
        String refreshToken = redisDao.getRefreshToken(String.valueOf(memberId));
        if (!refreshToken.equals(refreshTokenInput)) {
            throw new MemberException(INVALID_REFRESH_TOKEN);
        }
        return tokenProvider.createTokens(memberId);
    }

    public FindEmailResponse findEmail(String nameInput, String emailInput) {

        Member member = memberRepository.findByEmail(emailInput)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        String name = member.getName();
        String email = member.getEmail();

        if (name.equals(nameInput) && email.equals(emailInput)) {
            return new FindEmailResponse(email, true);
        }
        return new FindEmailResponse(email, false);
    }

    @Transactional
    public String sendTemporaryPassword(String email) {
        if (!memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(NOT_FOUND);
        }
        return emailService.sendTemporaryPassword(email);
    }

    @Transactional
    public String verifyTemporaryPassword(String email, String temporaryPassword, String newPassword) {
        boolean isVerified = emailService.verifyTemporaryPassword(email, temporaryPassword);

        if (isVerified) {
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new MemberException(NOT_FOUND));

            String encodedPassword = passwordEncoder.encode(newPassword);
            member.setPassword(encodedPassword);
            memberRepository.save(member);
        } else {
            throw new MemberException(WRONG_TEMPORARY_PASSWORD);
        }
        return RESET_PASSWORD_SUCCESS_MESSAGE;

    }
}
