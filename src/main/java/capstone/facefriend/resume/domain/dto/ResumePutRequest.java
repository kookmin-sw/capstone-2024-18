package capstone.facefriend.resume.domain.dto;

public record ResumePutRequest(
        Long resumeId,
        String category,
        String content
) {
}
