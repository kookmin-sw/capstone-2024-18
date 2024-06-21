package capstone.facefriend.member.dto.member;

public record SignUpRequest(
        String email,
        String password,
        String password2
) {
}
