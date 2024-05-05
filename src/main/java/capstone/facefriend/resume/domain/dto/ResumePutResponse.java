package capstone.facefriend.resume.domain.dto;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;

import java.util.List;

import static capstone.facefriend.resume.domain.Resume.Category;

public record ResumePutResponse(
        Long resumeId,
        List<String> resumeImageS3urls,
        FaceInfo faceInfo,
        BasicInfo basicInfo,
        AnalysisInfo analysisInfo,
        Category category,
        String content
) {
}
