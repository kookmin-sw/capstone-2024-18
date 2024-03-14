package capstone.facefriend.auth.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationContext;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.exception.AuthExceptionType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class LoginInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final AuthenticationContext authenticationContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = AuthenticationExtractor.extractAuth(request)
                .orElseThrow(() -> new AuthException(AuthExceptionType.UNAUTHORIZED));
        Long memberId = tokenProvider.extractId(token);
        authenticationContext.setAuthentication(memberId);
        return true;
    }
}
