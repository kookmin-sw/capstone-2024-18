package capstone.facefriend.common.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();
}
