package capstone.facefriend.member.domain;

import capstone.facefriend.member.exception.MemberException;
import capstone.facefriend.member.exception.MemberExceptionType;
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
