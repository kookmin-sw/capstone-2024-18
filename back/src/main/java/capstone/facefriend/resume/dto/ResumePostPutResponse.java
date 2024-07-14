package capstone.facefriend.resume.dto;

import static capstone.facefriend.resume.domain.Resume.Category;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import java.util.List;
import java.util.Set;

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
