package capstone.facefriend.auth.controller.interceptor;

import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import capstone.facefriend.redis.RedisDao;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


@RequiredArgsConstructor
@Component
@Slf4j
public class TokenBlackListInterceptor implements HandlerInterceptor {

    private final RedisDao redisDao;
    private final static String SIGN_OUT_VALUE = "SIGN_OUT_VALUE";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String accessToken = AuthenticationExtractor.extractAccessToken(request).get();

        if (accessToken != null && accessToken.equals(SIGN_OUT_VALUE)) {
            return !redisDao.isKeyOfAccessTokenInBlackList(accessToken); // 액세스 토큰이 블랙리스트에 등록되었다면 false 반환해야 합니다.
        }
        return true;
    }
}