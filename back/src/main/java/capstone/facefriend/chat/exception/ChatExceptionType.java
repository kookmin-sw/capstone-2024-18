package capstone.facefriend.chat.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum ChatExceptionType implements ExceptionType {

    NOT_FOUND_CHAT_ROOM(Status.NOT_FOUND, 5001, "일치하는 채팅방이 없습니다."),
    NOT_FOUND_CHAT_ROOM_MEMBER(Status.NOT_FOUND, 5002, "채팅방에 채팅방 멤버가 존재하지 않습니다."),
    FAIL_TO_SOCKET_INFO(Status.BAD_REQUEST, 5003, "소켓 연결 실패했습니다!"),
    INVALIDED_CHATROOM(Status.BAD_REQUEST, 5004, "유효한 채팅방이 아닙니다"),
    INVALID_ACCESS(Status.FORBIDDEN, 5005, "본인의 계정이 아닙니다."),
    UNAUTHORIZED(Status.UNAUTHORIZED, 5006, "접근 정보가 잘못되었습니다."),
    ALREADY_CHATROOM(Status.BAD_REQUEST, 5007, "이미 존재하는 채팅방입니다."),
    FAIL_AOP_AFTER_UPDATE_ORIGIN(Status.SERVER_ERROR, 5008, "원본 사진을 업로드했지만 가중치 사진을 업로드 실패했습니다."),
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