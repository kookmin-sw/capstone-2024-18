package capstone.facefriend.resume.exception;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class ResumeException extends BaseException {

    public ResumeException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}

