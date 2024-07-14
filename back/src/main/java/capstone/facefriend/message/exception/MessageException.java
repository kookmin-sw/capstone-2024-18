package capstone.facefriend.message.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class MessageException extends BaseException {

    public MessageException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}