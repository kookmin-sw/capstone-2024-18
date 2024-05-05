package capstone.facefriend.chat.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum ChatExceptionType implements ExceptionType {
    NOT_FOUND(Status.NOT_FOUND, 5001, "일치하는 채팅방이 없습니다."),
    INVALIDED_CHATROOM(Status.BAD_REQUEST, 5002, "유효한 채팅방이 아닙니다"),
    INVALID_ACCESS(Status.FORBIDDEN, 5003, "본인의 계정이 아닙니다."),
    UNAUTHORIZED(Status.UNAUTHORIZED, 5005, "접근 정보가 잘못되었습니다."),
    ALREADY_CHATROOM(Status.BAD_REQUEST, 5006, "이미 존재하는 채팅방입니다."),
    WRONG_PASSWORD(Status.BAD_REQUEST, 5007, "잘못된 비밀번호입니다."),
    EXPIRED_ACCESS_TOKEN(Status.BAD_REQUEST, 5008, "만료된 액세스 토큰이므로 재발급해야 합니다."),
    INVALID_ACCESS_TOKEN(Status.BAD_REQUEST, 5009, "유효하지 않은 액세스 토큰이므로 재발급해야 합니다."),
    INVALID_REFRESH_TOKEN(Status.BAD_REQUEST, 5010, "유효하지 않은 리프레시 토큰입니다. 토큰 재발급이 불가능합니다."),
    ACCESS_TOKEN_IS_IN_BLACKLIST(Status.BAD_REQUEST, 5011, "액세스 토큰이 로그아웃 처리되었습니다. 재로그인하시기 바랍니다."),
    NOT_VERIFIED(Status.BAD_REQUEST, 5012, "본인 인증을 먼저 완료해야 합니다."),
    PASSWORDS_NOT_EQUAL(Status.BAD_REQUEST, 5013, "재설정하는 비밀번호들이 동일하지 않습니다."),
    WRONG_TEMPORARY_PASSWORD(Status.BAD_REQUEST, 5014, "임시 비밀번호가 올바르지 않습니다."),
    NOT_FOUND_GENDER(Status.NOT_FOUND, 5015, "일치하는 성별이 없습니다.")
    ;
    private final Status status;
    private final int exceptionCode;
    private final String message;

    ChatExceptionType(Status status, int exceptionCode, String message) {
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