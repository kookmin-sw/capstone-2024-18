package capstone.facefriend.auth.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationContext;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.mail.controller.interceptor.VerificationInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


@RequiredArgsConstructor
@Component
@Slf4j
public class TokenReissueInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final AuthenticationContext authenticationContext;
    private final VerificationInterceptor verificationInterceptor;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request).get();

        Long memberId = tokenProvider.extractIdIgnoringExpiration(accessToken);
        authenticationContext.setAuthentication(memberId);

        return verificationInterceptor.preHandle(request, response, handler);
    }
}
