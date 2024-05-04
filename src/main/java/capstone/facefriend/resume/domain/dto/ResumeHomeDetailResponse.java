package capstone.facefriend.resume.domain.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Data;

@Data
public class ResumeHomeDetailResponse {
    private Long resumeId;
    private String thumbnailS3url;

    @QueryProjection
    public ResumeHomeDetailResponse(Long resumeId, String thumbnailS3url) {
        this.resumeId = resumeId;
        this.thumbnailS3url = thumbnailS3url;
    }
}
