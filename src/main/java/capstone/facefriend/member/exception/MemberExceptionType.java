package capstone.facefriend.member.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum MemberExceptionType implements ExceptionType {

    OT_FOUND(Status.NOT_FOUND, 3001, "회원이 없습니다"),
    NOT_FOUND_ROLE(Status.NOT_FOUND, 3002, "일치하는 권한이 없습니다"),
    INVALID_ACCESS(Status.FORBIDDEN, 3003, "본인의 계정이 아닙니다"),
    UNAUTHORIZED(Status.UNAUTHORIZED, 3005, "접근 정보가 잘못되었습니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    MemberExceptionType(Status status, int exceptionCode, String message) {
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
