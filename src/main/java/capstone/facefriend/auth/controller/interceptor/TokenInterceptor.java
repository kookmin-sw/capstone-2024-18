package capstone.facefriend.auth.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.exception.AuthExceptionType;
import capstone.facefriend.redis.RedisDao;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import static capstone.facefriend.auth.exception.AuthExceptionType.*;


@RequiredArgsConstructor
@Component
@Slf4j
public class TokenInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;
    private final RedisDao redisDao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request)
                .orElseThrow(() -> new AuthException(EXPIRED_TOKEN));

        boolean isKeyOfAccessTokenInBlackList = redisDao.isKeyOfAccessTokenInBlackList(accessToken);
        boolean isAccessTokenAlive = tokenProvider.validateExpiration(accessToken);
        boolean isAccessTokenIntact = tokenProvider.validateIntegrity(accessToken);

        return isAccessTokenAlive && isAccessTokenIntact && !isKeyOfAccessTokenInBlackList;
    }
}
