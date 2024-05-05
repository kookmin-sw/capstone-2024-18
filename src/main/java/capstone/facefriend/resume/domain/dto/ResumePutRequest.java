package capstone.facefriend.resume.domain.dto;

import java.util.List;

public record ResumePutRequest(
        List<String> categories,
        String content
) {
}
