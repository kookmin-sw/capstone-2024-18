package capstone.facefriend.resume.domain.dto;

import java.util.List;

public record ResumePostRequest(
        List<String> categories,
        String content
) {
}
