package capstone.facefriend.member.domain.member;

import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.exception.member.MemberExceptionType;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Role {
    USER("user"),
    ADMIN("admin");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public static Role from(String role) {
        return Arrays.stream(Role.values())
                .filter(it -> it.value.equalsIgnoreCase(role))
                .findFirst()
                .orElseThrow(() -> new MemberException(MemberExceptionType.NOT_FOUND_ROLE));
    }
}
