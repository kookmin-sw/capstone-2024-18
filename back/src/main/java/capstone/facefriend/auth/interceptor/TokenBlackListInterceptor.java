package capstone.facefriend.auth.interceptor;

import capstone.facefriend.auth.support.AuthenticationExtractor;
import capstone.facefriend.redis.RedisTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class TokenBlackListInterceptor implements HandlerInterceptor {

    private final RedisTokenService redisTokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request).get();

        if (accessToken != null) {
            return redisTokenService.isKeyOfAccessTokenInBlackList(accessToken); // 액세스 토큰이 블랙리스트에 등록되었다면 false 반환해야 합니다.
        }
        return true;
    }
}