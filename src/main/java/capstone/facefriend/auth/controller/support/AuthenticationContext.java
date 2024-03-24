package capstone.facefriend.auth.controller.support;


import capstone.facefriend.auth.exception.AuthException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Objects;

import static capstone.facefriend.auth.exception.AuthExceptionType.UNAUTHORIZED;

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
