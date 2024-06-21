package capstone.facefriend.bucket;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum BucketExceptionType implements ExceptionType {

    FAIL_TO_UPLOAD(Status.SERVER_ERROR, 9001, "S3 업로드에 실패했습니다."),
    FAIL_TO_GET_INPUT_STREAM(Status.SERVER_ERROR, 9002, "Input Stream 추출에 실패했습니다."),
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    BucketExceptionType(Status status, int exceptionCode, String message) {
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
