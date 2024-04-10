package capstone.facefriend.email.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.email.exception.VerificationException;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.exception.MemberException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;
import static capstone.facefriend.email.exception.VerificationExceptionType.NOT_VERIFIED;
import static capstone.facefriend.member.exception.MemberExceptionType.NOT_FOUND;


@RequiredArgsConstructor
@Component
@Slf4j
public class VerificationInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED));

        Long memberId = tokenProvider.extractId(accessToken);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        boolean isVerified = member.isVerified();
        if (!isVerified) throw new VerificationException(NOT_VERIFIED);

        return true;
    }
}
