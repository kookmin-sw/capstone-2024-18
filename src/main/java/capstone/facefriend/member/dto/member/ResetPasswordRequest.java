package capstone.facefriend.member.dto.member;

public record ResetPasswordRequest(
        String newPassword,
        String newPassword2
) {
}
