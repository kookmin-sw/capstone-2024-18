package capstone.facefriend.resume.exception;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum ResumeExceptionType implements ExceptionType {

    NO_RESUME(Status.NOT_FOUND, 7001, "자기소개서가 없습니다!"),
    ALREADY_HAS_RESUME(Status.BAD_REQUEST, 7002, "자기소개서는 1인당 1개만 생성할 수 있습니다!"),
    UNAUTHORIZED(Status.UNAUTHORIZED, 7003, "나의 자기소개서가 아닙니다!"),
    FAIL_TO_DELETE(Status.BAD_REQUEST, 7004, "자기소개서 삭제 실패"),
    MUST_UPLOAD_ONE_IMAGE(Status.BAD_REQUEST, 7005, "최소한 1개 이상의 이미지를 업로드해야 합니다!"),
    MUST_SELECT_ONE_CATEGORY(Status.BAD_REQUEST, 7006, "최소한 1개 이상의 카테고리를 선택해야 합니다!"),
    MUST_FILL_CONTENT(Status.BAD_REQUEST, 7007, "내용을 작성해야 합니다!")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    ResumeExceptionType(Status status, int exceptionCode, String message) {
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

