package capstone.facefriend.member.service.dto;

import java.util.List;

public record ResumeResponse(
    List<String> resumeImages,
    String category,
    String content
) {
}
