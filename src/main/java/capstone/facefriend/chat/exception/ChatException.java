package capstone.facefriend.chat.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class ChatException extends BaseException {
    public ChatException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}