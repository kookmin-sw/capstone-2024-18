package capstone.facefriend.member.service;

import static capstone.facefriend.member.exception.member.MemberExceptionType.DUPLICATED_EMAIL;
import static capstone.facefriend.member.exception.member.MemberExceptionType.INVALID_REFRESH_TOKEN;
import static capstone.facefriend.member.exception.member.MemberExceptionType.NOT_FOUND;
import static capstone.facefriend.member.exception.member.MemberExceptionType.WRONG_PASSWORD;
import static capstone.facefriend.member.exception.member.MemberExceptionType.WRONG_TEMPORARY_PASSWORD;

import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.email.controller.dto.EmailVerificationResponse;
import capstone.facefriend.email.service.EmailService;
import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.dto.member.FindEmailResponse;
import capstone.facefriend.member.dto.member.SignInRequest;
import capstone.facefriend.member.dto.member.SignUpRequest;
import capstone.facefriend.member.dto.member.SignupResponse;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.redis.RedisTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    private final MemberRepository memberRepository;
    private final MemberInitService memberInitService;
    private final EmailService emailService;
    private final RedisTokenService redisTokenService;

    private static final String SIGN_UP_VALID_EMAIL = "사용 가능한 이메일입니다.";
    private static final String SIGN_OUT_SUCCESS_MESSAGE = "로그아웃 성공";
    private static final String RESET_PASSWORD_SUCCESS_MESSAGE = "비밀번호 재설정 성공";
    private static final String EXIT_SUCCESS_MESSAGE = "회원탈퇴 성공";

    @Value("${blacklist.remain-time}")
    private Long blackListRemainTime;

    @Transactional
    public String verifyDuplication(String email) {
        if (memberRepository.findByEmail(email).isPresent()) {
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
    public SignupResponse signUp(SignUpRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());

        BasicInfo basicInfo = memberInitService.initBasicInfo();
        FaceInfo faceInfo = memberInitService.initFaceInfo();
        AnalysisInfo analysisInfo = memberInitService.initAnalysisInfo();
        Member member = memberInitService.initMember(request, encodedPassword, basicInfo, faceInfo, analysisInfo);

        return new SignupResponse(member.getId());
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
        return jwtProvider.createTokens(member.getId());
    }

    @Transactional
    public String signOut(Long memberId, String accessToken) {
        redisTokenService.deleteRefreshToken(String.valueOf(memberId));
        redisTokenService.setAccessTokenSignOut(accessToken, blackListRemainTime);
        return SIGN_OUT_SUCCESS_MESSAGE;
    }

    @Transactional
    public String exit(Long memberId) {
        if (memberRepository.findById(memberId).isPresent()) {
            memberRepository.deleteById(memberId);
        }
        return EXIT_SUCCESS_MESSAGE;
    }

    @Transactional
    public TokenResponse reissueTokens(Long memberId, String refreshTokenInput) {
        String refreshToken = redisTokenService.getRefreshToken(String.valueOf(memberId));
        if (!refreshToken.equals(refreshTokenInput)) {
            throw new MemberException(INVALID_REFRESH_TOKEN);
        }
        return jwtProvider.createTokens(memberId);
    }

    @Transactional
    public FindEmailResponse findEmail(String emailInput) {
        Member member = memberRepository.findByEmail(emailInput)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        String email = member.getEmail();

        if (email.equals(emailInput)) {
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

    @Transactional
    public String resetPassword(Long memberId, String newPassword) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        String encodedPassword = passwordEncoder.encode(newPassword);

        member.setPassword(encodedPassword);
        memberRepository.save(member);

        return RESET_PASSWORD_SUCCESS_MESSAGE;
    }
}
