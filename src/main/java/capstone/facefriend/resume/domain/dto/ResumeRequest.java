package capstone.facefriend.resume.domain.dto;

public record ResumeRequest(
        Long resumeId,
        String category,
        String content
) {
}
