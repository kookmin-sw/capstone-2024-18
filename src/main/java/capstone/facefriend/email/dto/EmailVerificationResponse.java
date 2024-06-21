package capstone.facefriend.email.dto;

public record EmailVerificationResponse(
    String email,
    boolean isVerified
) {
}
