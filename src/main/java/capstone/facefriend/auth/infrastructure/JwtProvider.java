package capstone.facefriend.auth.infrastructure;


import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.redis.RedisDao;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static capstone.facefriend.auth.exception.AuthExceptionType.*;

@Getter
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtProvider implements TokenProvider {

    @Value("${jwt.secret}")
    private String secret;
    private Key key;

    private final RedisDao redisDao;

    private static final long ACCESS_TOKEN_EXPIRATION_TIME = 60 * 5L; // 5분 // 1000 * 60 * 60 * 3L; // 3시간
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7L; // 7일

    @PostConstruct
    private void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public TokenResponse createTokens(Long memberId) {
        String accessToken = createAccessToken(memberId);
        String refreshToken = createRefreshToken(memberId);
        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public String createAccessToken(Long id) {
        Claims claims = Jwts.claims();
        claims.put("id", id);
        return accessToken(claims);
    }

    @Override
    public String createRefreshToken(Long id) {
        Claims claims = Jwts.claims();
        claims.put("id", id);

        String refreshToken = refreshToken(claims);
        redisDao.setRefreshToken(String.valueOf(id), refreshToken, REFRESH_TOKEN_EXPIRATION_TIME);
        return refreshToken;
    }

    private String accessToken(Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt())
                .setExpiration(accessTokenExpiredAt())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String refreshToken(Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt())
                .setExpiration(refreshTokenExpiredAt())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Date issuedAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
    }

    private Date accessTokenExpiredAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.plusSeconds(ACCESS_TOKEN_EXPIRATION_TIME).atZone(ZoneId.systemDefault()).toInstant());
    }

    private Date refreshTokenExpiredAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.plusSeconds(REFRESH_TOKEN_EXPIRATION_TIME).atZone(ZoneId.systemDefault()).toInstant());
    }

    // 일반적인 경우에 사용합니다.
    @Override
    public Long extractId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("id", Long.class);
        } catch (ExpiredJwtException e) {
            throw new AuthException(EXPIRED_TOKEN);
        } catch (SecurityException e) {
            throw new AuthException(SIGNATURE_NOT_FOUND);
        } catch (MalformedJwtException e) {
            throw new AuthException(MALFORMED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new AuthException(UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new AuthException(INVALID_TOKEN);
        }
    }

    // 재발급 시에만 사용합니다.
    @Override
    public Long extractIdIgnoringExpiration(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("id", Long.class);
        } catch (ExpiredJwtException e) {
            Claims expiredClaims = e.getClaims(); // catch 후 id 를 반환하고 이를 사용해 액세스 토큰을 추출할 수 있습니다.
            return expiredClaims.get("id", Long.class);
        } catch (SecurityException e) {
            throw new AuthException(SIGNATURE_NOT_FOUND);
        } catch (MalformedJwtException e) {
            throw new AuthException(MALFORMED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new AuthException(UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new AuthException(INVALID_TOKEN);
        }
    }
}
