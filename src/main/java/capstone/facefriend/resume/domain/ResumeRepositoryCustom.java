package capstone.facefriend.resume.domain;

import capstone.facefriend.resume.service.dto.ResumeHomeDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRepositoryCustom {

    Page<ResumeHomeDetailResponse> getResumesByGoodCombi(Long memberId, Pageable pageable); // 좋은 궁합
    Page<ResumeHomeDetailResponse> getResumesByCategory(String category, Pageable pageable); // 카테고리별
}
