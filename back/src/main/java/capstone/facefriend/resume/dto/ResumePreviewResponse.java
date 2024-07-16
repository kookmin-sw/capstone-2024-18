package capstone.facefriend.resume.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class ResumePreviewResponse {

    private Long resumeId;
    private String thumbnailS3url;

    @QueryProjection
    public ResumePreviewResponse(Long resumeId, String thumbnailS3url) {
        this.resumeId = resumeId;
        this.thumbnailS3url = thumbnailS3url;
    }
}
