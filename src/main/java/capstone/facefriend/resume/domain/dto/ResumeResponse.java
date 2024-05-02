package capstone.facefriend.resume.domain.dto;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;

import static capstone.facefriend.resume.domain.Resume.Category;

public record ResumeResponse(
        Long resumeId,
        BasicInfo basicInfo,
        FaceInfo faceInfo,
        AnalysisInfo analysisInfo,
        Category category,
        String content
) {
}
