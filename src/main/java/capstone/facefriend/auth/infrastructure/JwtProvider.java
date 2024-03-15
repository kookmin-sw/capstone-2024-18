package capstone.facefriend.auth.infrastructure;


import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.auth.exception.AuthException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static capstone.facefriend.auth.exception.AuthExceptionType.*;

@Getter
@Component
@NoArgsConstructor
public class JwtProvider implements TokenProvider {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration-period}")
    private int expirationPeriod;
    private Key key;

    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7L; // 7 days

    @PostConstruct
    private void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public String create(Long id) {
        Claims claims = Jwts.claims();
        claims.put("id", id);
        return createToken(claims);
    }

    private String createToken(Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt())
                .setExpiration(expiredAt())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private Date issuedAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
    }

    private Date expiredAt() {
        LocalDateTime now = LocalDateTime.now();
        return Date.from(now.plusHours(expirationPeriod).atZone(ZoneId.systemDefault()).toInstant());
    }

    @Override
    public Long extractId(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret.getBytes())
                    .parseClaimsJws(token)
                    .getBody()
                    .get("id", Long.class);
        } catch (SecurityException e) {
            throw new AuthException(SIGNATURE_NOT_FOUND);
        } catch (MalformedJwtException e) {
            throw new AuthException(MALFORMED_TOKEN);
        } catch (ExpiredJwtException e) {
            throw new AuthException(EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new AuthException(UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new AuthException(INVALID_TOKEN);
        }
    }
}
