package capstone.facefriend.member.service.dto;

public record FindEmailResponse(
    String email,
    boolean isRegistered
) {
}
