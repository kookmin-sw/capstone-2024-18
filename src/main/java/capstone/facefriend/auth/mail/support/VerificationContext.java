package capstone.facefriend.auth.mail.support;


import capstone.facefriend.auth.mail.exception.VerificationException;
import capstone.facefriend.auth.mail.exception.VerificationExceptionType;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Objects;

import static capstone.facefriend.auth.mail.exception.VerificationExceptionType.*;

@RequestScope
@Component
public class VerificationContext {

    private static final boolean IS_NOT_VERIFIED = false;
    private Boolean isVerified;

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsVerified() {
        if (Objects.isNull(this.isVerified)) {
            throw new VerificationException(NOT_VERIFIED);
        }
        return isVerified;
    }

    public void setNotVerified() {
        this.isVerified = IS_NOT_VERIFIED;
    }
}
