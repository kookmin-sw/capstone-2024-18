package capstone.facefriend.redis;


import capstone.facefriend.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Component;
import java.util.concurrent.TimeUnit;

import static capstone.facefriend.member.exception.MemberExceptionType.ALREADY_SIGN_OUT_ACCESS_TOKEN;

@Component
@Slf4j
@RequiredArgsConstructor
public class RedisDao {

    private final RedisTemplate<String, String> redisTemplate;
    private final String SIGN_OUT_VALUE = "SIGN_OUT_VALUE";

    public void setRefreshToken(String memberId, String refreshToken, long refreshTokenTime) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        redisTemplate.opsForValue().set(memberId, refreshToken, refreshTokenTime, TimeUnit.MINUTES);
    }

    public String getRefreshToken(String memberId) {
        return redisTemplate.opsForValue().get(memberId);
    }

    public void deleteRefreshToken(String memberId) {
        redisTemplate.delete(memberId);
    }

    public void setAccessTokenSignOut(String accessToken, Long minute) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        redisTemplate.opsForValue().set(accessToken, SIGN_OUT_VALUE, minute, TimeUnit.MINUTES);
    }

    public boolean isKeyOfAccessTokenInBlackList(String accessToken) {
        String signOutValue = redisTemplate.opsForValue().get(accessToken);
        if (signOutValue.equals(SIGN_OUT_VALUE)) {
            throw new MemberException(ALREADY_SIGN_OUT_ACCESS_TOKEN);
        }
        return false;
    }

    public void setCode(String mail, String code, long codeTime) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        redisTemplate.opsForValue().set(mail, code, codeTime, TimeUnit.MINUTES);
    }

    public String getCode(String mail) {
        return redisTemplate.opsForValue().get(mail);
    }

    public void flushAll() {
        redisTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
    }
}
