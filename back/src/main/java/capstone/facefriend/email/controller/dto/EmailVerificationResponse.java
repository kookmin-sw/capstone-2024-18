package capstone.facefriend.email.controller.dto;

public record EmailVerificationResponse(
    String email,
    boolean isVerified
) {
}
