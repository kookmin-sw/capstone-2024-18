package capstone.facefriend.member.exception.member;

import capstone.facefriend.common.exception.ExceptionType;
import capstone.facefriend.common.exception.Status;

public enum MemberExceptionType implements ExceptionType {

    NOT_FOUND(Status.NOT_FOUND, 3001, "회원이 없습니다."),
    NOT_FOUND_ROLE(Status.NOT_FOUND, 3002, "일치하는 권한이 없습니다."),
    INVALID_ACCESS(Status.FORBIDDEN, 3003, "본인의 계정이 아닙니다."),
    UNAUTHORIZED(Status.UNAUTHORIZED, 3005, "접근 정보가 잘못되었습니다."),
    DUPLICATED_EMAIL(Status.BAD_REQUEST, 3006, "이미 사용 중인 이메일입니다."),
    WRONG_PASSWORD(Status.BAD_REQUEST, 3007, "잘못된 비밀번호입니다."),
    EXPIRED_ACCESS_TOKEN(Status.BAD_REQUEST, 3008, "만료된 액세스 토큰이므로 재발급해야 합니다."),
    INVALID_ACCESS_TOKEN(Status.BAD_REQUEST, 3009, "유효하지 않은 액세스 토큰이므로 재발급해야 합니다."),
    INVALID_REFRESH_TOKEN(Status.BAD_REQUEST, 3010, "유효하지 않은 리프레시 토큰입니다. 토큰 재발급이 불가능합니다."),
    ACCESS_TOKEN_IS_IN_BLACKLIST(Status.BAD_REQUEST, 3011, "액세스 토큰이 로그아웃 처리되었습니다. 재로그인하시기 바랍니다."),
    NOT_VERIFIED(Status.BAD_REQUEST, 3012, "본인 인증을 먼저 완료해야 합니다."),
    PASSWORDS_NOT_EQUAL(Status.BAD_REQUEST, 3013, "재설정하는 비밀번호들이 동일하지 않습니다."),
    WRONG_TEMPORARY_PASSWORD(Status.BAD_REQUEST, 3014, "임시 비밀번호가 올바르지 않습니다."),
    NOT_FOUND_GENDER(Status.NOT_FOUND, 3015, "일치하는 성별이 없습니다.")
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    MemberExceptionType(Status status, int exceptionCode, String message) {
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
