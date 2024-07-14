package capstone.facefriend.resume.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record ResumePostPutRequest(
        List<MultipartFile> images,
        List<String> categories,
        String content
) {

}
