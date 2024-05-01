package capstone.facefriend.member.service.dto.member;

public record FindEmailResponse(
        String email,
        boolean isRegistered
) {
}
