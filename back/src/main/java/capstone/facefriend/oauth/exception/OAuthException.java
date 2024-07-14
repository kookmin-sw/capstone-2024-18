package capstone.facefriend.oauth.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class OAuthException extends BaseException {

    public OAuthException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
