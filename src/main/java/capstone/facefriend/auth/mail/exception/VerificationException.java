package capstone.facefriend.auth.mail.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class VerificationException extends BaseException {

    public VerificationException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
