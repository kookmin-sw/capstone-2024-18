package capstone.facefriend.mail.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum VerificationExceptionType implements ExceptionType {

    NOT_VERIFIED(Status.UNAUTHORIZED, 4001, "서비스를 사용하기 위해선 본인인증이 필요합니다.")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    VerificationExceptionType(Status status, int exceptionCode, String message) {
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
