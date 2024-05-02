package capstone.facefriend.member.service.dto.member;

public record ResetPasswordRequest(
        String newPassword,
        String newPassword2
) {
}
