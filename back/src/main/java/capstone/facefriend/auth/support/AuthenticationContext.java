package capstone.facefriend.auth.support;

import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;

import capstone.facefriend.auth.exception.AuthException;
import java.util.Objects;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@RequestScope
@Component
public class AuthenticationContext {

    private static final long ANONYMOUS_MEMBER = -1L;
    private Long memberId;

    public void setAuthentication(Long memerId) {
        this.memberId = memerId;
    }

    public Long getAuthentication() {
        if (Objects.isNull(this.memberId)) {
            throw new AuthException(UNAUTHORIZED);
        }
        return memberId;
    }

    public void setNotAuthenticated() {
        this.memberId = ANONYMOUS_MEMBER;
    }
}
