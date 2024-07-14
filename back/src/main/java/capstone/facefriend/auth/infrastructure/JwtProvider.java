package capstone.facefriend.auth.infrastructure;

import static capstone.facefriend.auth.exception.AuthExceptionType.EXPIRED_TOKEN;
import static capstone.facefriend.auth.exception.AuthExceptionType.INVALID_TOKEN;
import static capstone.facefriend.auth.exception.AuthExceptionType.MALFORMED_TOKEN;
import static capstone.facefriend.auth.exception.AuthExceptionType.NOT_ACCESS_TOKEN;
import static capstone.facefriend.auth.exception.AuthExceptionType.SIGNATURE_NOT_FOUND;
import static capstone.facefriend.auth.exception.AuthExceptionType.UNSUPPORTED_TOKEN;

import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.redis.RedisTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.access-token-identifier}")
    private String accessTokenIdentifier;
    @Value("${jwt.access-token-exp-time}")
    private long accessTokenExp;
    @Value("${jwt.refresh-token-exp-time}")
    private long refreshTokenExp;

    private Key key;

    private final RedisTokenService redisTokenService;

    @PostConstruct
    private void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public TokenResponse createTokens(Long memberId) {
        String accessToken = createAccessToken(memberId);
        String refreshToken = createRefreshToken(memberId);
        return new TokenResponse(accessToken, refreshToken);
    }

    public String createAccessToken(Long id) {
        Claims claims = Jwts.claims();
        claims.put("id", id);
        claims.put("identifier", accessTokenIdentifier);
        return accessToken(claims);
    }

    public String createRefreshToken(Long id) {
        Claims claims = Jwts.claims();
        claims.put("id", id);
        String refreshToken = refreshToken(claims);
        redisTokenService.setRefreshToken(String.valueOf(id), refreshToken, refreshTokenExp);
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
        return Date.from(now.plusSeconds(accessTokenExp).atZone(ZoneId.systemDefault()).toInstant());
    }

    private Date refreshTokenExpiredAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.plusSeconds(refreshTokenExp).atZone(ZoneId.systemDefault()).toInstant());
    }

    public Long extractId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secret.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if (!claims.get("identifier", String.class).equals(accessTokenIdentifier)) {
                throw new AuthException(NOT_ACCESS_TOKEN);
            }

            return claims.get("id", Long.class);

        } catch (NullPointerException e) { // identifier 키값이 존재하지 않을 경우
            throw new AuthException(NOT_ACCESS_TOKEN);
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

    public Long extractIdIgnoringExpiration(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secret.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if (!claims.get("identifier", String.class).equals(accessTokenIdentifier)) {
                throw new AuthException(NOT_ACCESS_TOKEN);
            }

            return claims.get("id", Long.class);

        } catch (NullPointerException e) { // identifier 키값이 존재하지 않을 경우
            throw new AuthException(NOT_ACCESS_TOKEN);
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
