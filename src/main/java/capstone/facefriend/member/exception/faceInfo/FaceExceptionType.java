package capstone.facefriend.member.exception.faceInfo;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum FaceExceptionType implements ExceptionType {

    CANNOT_GET_BYTE(Status.SERVER_ERROR, 8001, "바이트를 추출할 수 없습니다."),
    CANNOT_GET_INPUT_STREAM(Status.SERVER_ERROR, 8002, "인풋 스트림을 추출할 수 없습니다.");
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    FaceExceptionType(Status status, int exceptionCode, String message) {
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
