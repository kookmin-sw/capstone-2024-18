package capstone.facefriend.resume.domain.dto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record ResumePostRequest(
        Long resumeId,
        List<MultipartFile> images,
        String category,
        String content
) {
}
