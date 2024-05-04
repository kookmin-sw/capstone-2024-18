package capstone.facefriend.resume.domain.dto;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.resume.domain.Resume;

import java.util.List;

public record ResumeGetResponse(
        Long resumeId,
        List<String> resumeImageS3urls,
        FaceInfo faceInfo,
        BasicInfo basicInfo,
        AnalysisInfo analysisInfo,
        Resume.Category category,
        String content,
        Boolean isMine
) {
}
