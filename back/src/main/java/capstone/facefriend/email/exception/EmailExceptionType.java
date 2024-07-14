package capstone.facefriend.email.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum EmailExceptionType implements ExceptionType {

    UNABLE_TO_SEND_EMAIL(Status.BAD_REQUEST, 1001, "인증 메일을 보낼 수 없습니다."),
    NO_SUCH_ALGORITHM(Status.SERVER_ERROR,1002,"인증 코드 생성에 실패했습니다."),
    WRONG_EMAIL(Status.BAD_REQUEST, 1003, "올바르지 않은 이메일입니다.")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    EmailExceptionType(Status status, int exceptionCode, String message) {
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
