package capstone.facefriend.email.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class EmailException extends BaseException {

    public EmailException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
