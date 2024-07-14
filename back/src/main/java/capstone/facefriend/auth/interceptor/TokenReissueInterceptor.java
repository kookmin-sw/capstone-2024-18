package capstone.facefriend.auth.interceptor;

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
public class TokenReissueInterceptor implements HandlerInterceptor {

    private final JwtProvider jwtProvider;
    private final AuthenticationContext authenticationContext;
    private final TokenBlackListInterceptor tokenBlackListInterceptor;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request).get();

        Long memberId = jwtProvider.extractIdIgnoringExpiration(accessToken);
        authenticationContext.setAuthentication(memberId);

        return tokenBlackListInterceptor.preHandle(request, response, handler);
    }
}
