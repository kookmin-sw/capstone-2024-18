package capstone.facefriend.member.exception.faceInfo;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum FaceInfoExceptionType implements ExceptionType {

    FAIL_TO_GENERATE(Status.SERVER_ERROR, 8001, "관상 이미지 생성에 실패했습니다."),
    FAIL_TO_GET_BYTES(Status.SERVER_ERROR, 8002, "바이트를 추출할 수 없습니다.")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    FaceInfoExceptionType(Status status, int exceptionCode, String message) {
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
