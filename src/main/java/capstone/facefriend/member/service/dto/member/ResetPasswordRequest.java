package capstone.facefriend.member.service.dto;

public record ResetPasswordRequest(
    String newPassword,
    String newPassword2
) {
}
