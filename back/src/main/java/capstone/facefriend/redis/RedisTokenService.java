package capstone.facefriend.redis;

import static capstone.facefriend.member.exception.member.MemberExceptionType.ACCESS_TOKEN_IS_IN_BLACKLIST;

import capstone.facefriend.member.exception.member.MemberException;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisTokenService {

    @Value("${redis.token.sign-out}")
    private String SIGN_OUT_VALUE;

    private final RedisTemplate<String, String> redisTokenTemplate;

    public void setRefreshToken(String memberId, String refreshToken, long refreshTokenTime) {
        redisTokenTemplate.opsForValue().set(memberId, refreshToken, refreshTokenTime, TimeUnit.MINUTES);
    }

    public String getRefreshToken(String memberId) {
        return redisTokenTemplate.opsForValue().get(memberId);
    }

    public void deleteRefreshToken(String memberId) {
        redisTokenTemplate.delete(memberId);
    }

    public void setAccessTokenSignOut(String accessToken, Long minute) {
        redisTokenTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        redisTokenTemplate.opsForValue().set(accessToken, SIGN_OUT_VALUE, minute, TimeUnit.MINUTES);
    }

    public boolean isKeyOfAccessTokenInBlackList(String accessToken) {
        String signOutValue = redisTokenTemplate.opsForValue().get(accessToken);
        if (signOutValue != null && signOutValue.equals(SIGN_OUT_VALUE)) {
            throw new MemberException(ACCESS_TOKEN_IS_IN_BLACKLIST);
        }
        return true;
    }

    public void setCode(String mail, String code, long codeTime) {
        redisTokenTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        redisTokenTemplate.opsForValue().set(mail, code, codeTime, TimeUnit.MINUTES);
    }

    public String getCode(String mail) {
        return redisTokenTemplate.opsForValue().get(mail);
    }

    public void flushAll() {
        redisTokenTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
    }
}
