package capstone.facefriend.auth.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum AuthExceptionType implements ExceptionType {

    INVALID_AUTH_PROVIDER(Status.UNAUTHORIZED, 2001, "지원하지 않는 로그인 플랫폼입니다."),
    SIGNATURE_NOT_FOUND(Status.BAD_REQUEST, 2002, "JWT 서명을 확인하지 못했습니다."),
    MALFORMED_TOKEN(Status.BAD_REQUEST, 2003, "토큰의 길이 및 형식이 올바르지 않습니다."),
    EXPIRED_TOKEN(Status.UNAUTHORIZED, 2004, "이미 만료된 토큰입니다."),
    UNSUPPORTED_TOKEN(Status.BAD_REQUEST, 2005, "지원되지 않는 토큰입니다."),
    INVALID_TOKEN(Status.BAD_REQUEST, 2006, "토큰이 유효하지 않습니다."),
    BAD_REQUEST_TO_PROVIDER(Status.BAD_REQUEST, 2007, "토큰이 유효하지 않습니다."),
    UNAUTHORIZED(Status.UNAUTHORIZED, 2008, "로그인한 정보가 없습니다."),
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    AuthExceptionType(Status status, int exceptionCode, String message) {
        this.status = status;
        this.exceptionCode = exceptionCode;
        this.message = message;
    }

    @Override
    public Status status() {
        return null;
    }

    @Override
    public int exceptionCode() {
        return 0;
    }

    @Override
    public String message() {
        return null;
    }
}
