package capstone.facefriend.mail.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class MailException extends BaseException {

    public MailException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
