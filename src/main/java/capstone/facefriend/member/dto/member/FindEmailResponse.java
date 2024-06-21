package capstone.facefriend.member.dto.member;

public record FindEmailResponse(
        String email,
        boolean isRegistered
) {
}
