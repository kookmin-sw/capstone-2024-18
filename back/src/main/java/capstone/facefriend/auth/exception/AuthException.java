package capstone.facefriend.auth.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class AuthException extends BaseException {

    public AuthException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
