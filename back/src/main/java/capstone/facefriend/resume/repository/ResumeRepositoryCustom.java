package capstone.facefriend.resume.repository;

import capstone.facefriend.resume.dto.ResumeHomeDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRepositoryCustom {

    Page<ResumeHomeDetailResponse> getResumesByGoodCombi(Long memberId, Pageable pageable); // 좋은 궁합
    Page<ResumeHomeDetailResponse> getResumesByCategory(Long memberId, String category, Pageable pageable); // 카테고리별
}
