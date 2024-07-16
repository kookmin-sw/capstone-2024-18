package capstone.facefriend.resume.repository;

import capstone.facefriend.resume.dto.ResumePreviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRepositoryCustom {

    Page<ResumePreviewResponse> getResumesByGoodCombi(Long memberId, Pageable pageable);

    Page<ResumePreviewResponse> getResumesByCategory(Long memberId, String category, Pageable pageable);
}
