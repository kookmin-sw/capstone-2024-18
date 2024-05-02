package capstone.facefriend.resume.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum ResumeExceptionType implements ExceptionType {

    NO_RESUME(Status.NOT_FOUND, 7001, "자기소개서가 없습니다!."),
    ALREADY_HAVE_RESUME(Status.BAD_REQUEST, 7002, "자기소개서는 1인당 1개만 생성할 수 있습니다!")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    ResumeExceptionType(Status status, int exceptionCode, String message) {
        this.status = status;
        this.exceptionCode = exceptionCode;
        this.message = message;
    }

    @Override
    public Status status() {
        return status;
    }

    @Override
    public int exceptionCode() {
        return exceptionCode;
    }

    @Override
    public String message() {
        return message;
    }
}

