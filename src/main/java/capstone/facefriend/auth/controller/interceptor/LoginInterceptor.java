package capstone.facefriend.auth.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationContext;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;

@RequiredArgsConstructor
@Component
@Slf4j
public class LoginInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final AuthenticationContext authenticationContext;
    private final TokenReissueInterceptor tokenReissueInterceptor;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED));

        Long memberId = tokenProvider.extractId(accessToken);
        authenticationContext.setAuthentication(memberId);

        return tokenReissueInterceptor.preHandle(request, response, handler);
    }
}
