package capstone.facefriend.chat.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum ChatExceptionType implements ExceptionType {
    NOT_FOUND(Status.NOT_FOUND, 5001, "일치하는 채팅방이 없습니다."),
    INVALIDED_CHATROOM(Status.BAD_REQUEST, 5002, "유효한 채팅방이 아닙니다"),
    INVALID_ACCESS(Status.FORBIDDEN, 5003, "본인의 계정이 아닙니다."),
    UNAUTHORIZED(Status.UNAUTHORIZED, 5005, "접근 정보가 잘못되었습니다."),
    ALREADY_CHATROOM(Status.BAD_REQUEST, 5006, "이미 존재하는 채팅방입니다."),

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