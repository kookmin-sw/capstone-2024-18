package capstone.facefriend.resume.service.dto;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;

import java.util.List;
import java.util.Set;

import static capstone.facefriend.resume.domain.Resume.Category;

public record ResumePostPutResponse(
        Long resumeId,
        Long memberId,
        List<String> resumeImageS3urls,
        FaceInfo faceInfo,
        BasicInfo basicInfo,
        AnalysisInfo analysisInfo,
        Set<Category> categories,
        String content
) {
}
