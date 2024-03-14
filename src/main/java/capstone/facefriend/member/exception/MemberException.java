package capstone.facefriend.member.exception;

import capstone.back.common.exception.BaseException;
import capstone.back.common.exception.ExceptionType;

public class MemberException extends BaseException {

    public MemberException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
