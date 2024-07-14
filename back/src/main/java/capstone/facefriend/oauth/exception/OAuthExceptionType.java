package capstone.facefriend.oauth.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum OAuthExceptionType implements ExceptionType {

    INVALID_OAUTH_PROVIDER(Status.BAD_REQUEST, 1001, "유효하지 않은 OAUTH 제공자입니다."),
    FAIL_TO_REQUEST_OAUTH_TOKEN(Status.BAD_REQUEST, 1002, "OAUTH 토큰 요청에 실패했습니다."),
    FAIL_TO_REQUEST_OAUTH_USER_INFO(Status.BAD_REQUEST, 1003, "OAUTH 유저 정보 요청에 실패했습니다."),
    INVALID_SECRET(Status.BAD_REQUEST, 1004, "시크릿 값이 일치하지 않습니다."),
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    OAuthExceptionType(Status status, int exceptionCode, String message) {
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