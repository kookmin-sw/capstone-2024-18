package capstone.facefriend.auth.interceptor;

import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;

import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.auth.support.AuthenticationContext;
import capstone.facefriend.auth.support.AuthenticationExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class LoginInterceptor implements HandlerInterceptor {

    private final JwtProvider jwtProvider;
    private final AuthenticationContext authenticationContext;
    private final TokenReissueInterceptor tokenReissueInterceptor;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED));

        Long memberId = jwtProvider.extractId(accessToken);
        authenticationContext.setAuthentication(memberId);

        return tokenReissueInterceptor.preHandle(request, response, handler);
    }
}
