package capstone.facefriend.resume.domain.dto;

import java.util.List;

public record ResumeRequest(
        List<String> categories,
        String content
) {
}
