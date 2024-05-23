package capstone.facefriend.member.service.dto.member;

public record SignUpRequest(
        String email,
        String password,
        String password2
) {
}
