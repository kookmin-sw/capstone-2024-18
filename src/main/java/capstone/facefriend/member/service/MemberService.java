package capstone.facefriend.member.service;

import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.service.dto.SignInRequest;
import capstone.facefriend.member.service.dto.SignUpRequest;
import capstone.facefriend.redis.RedisDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static capstone.facefriend.member.domain.Role.USER;
import static capstone.facefriend.member.exception.MemberExceptionType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    private final RedisDao redisDao;

    private static final String SIGN_UP_SUCCESS_MESSAGE = "회원가입 성공";
    private static final String SIGN_OUT_SUCCESS_MESSAGE = "로그아웃 성공";
    private static final Long SIGN_OUT_MINUTE = 1000 * 60 * 60 * 12L; // 12 시간

    @Transactional
    public String signUp(SignUpRequest request) {
        String email = request.email();

        Optional<Member> isPresent = memberRepository.findByEmail(email);
        if (isPresent.isPresent()) {
            throw new MemberException(DUPLICATED_EMAIL);
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        Member member = Member.builder()
                .email(email)
                .password(encodedPassword)
                .name(request.name())
                .role(USER)
                .build();
        memberRepository.save(member);

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
}
