package capstone.facefriend.member.service.dto;

public record SignUpRequest(
    String email,
    String password,
    String password2,
    boolean isVerified
) {
}
