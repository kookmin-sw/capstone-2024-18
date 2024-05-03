package capstone.facefriend.member.exception.member;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class MemberException extends BaseException {

    public MemberException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
