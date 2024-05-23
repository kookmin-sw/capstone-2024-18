package capstone.facefriend.common.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {
}
