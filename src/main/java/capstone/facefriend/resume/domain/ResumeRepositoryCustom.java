package capstone.facefriend.resume.domain;

import capstone.facefriend.resume.domain.dto.ResumeHomeDetailResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResumeRepositoryCustom {

    // 홈 페이지 : 20개
    List<ResumeHomeDetailResponse> getHomeResumesByGoodCombi(Long memberId, Pageable pageable); // 관상 궁합 좋은 20개
    List<ResumeHomeDetailResponse> getHomeResumesByBadCombi(Long memberId, Pageable pageable); // 관상 궁합 나쁜 20개
    List<ResumeHomeDetailResponse> getHomeResumesByCategory(String category, Pageable pageable); // 카테고리별 20개

    // 디테일 페이지 : 10개
    List<ResumeHomeDetailResponse> getDetailResumesByGoodCombi(Long memberId, Pageable pageable); // 관상 궁합 좋은 10개
    List<ResumeHomeDetailResponse> getDetailResumesByBadCombi(Long memberId, Pageable pageable); // 관상 궁합 나쁜 10개
    List<ResumeHomeDetailResponse> getDetailResumesByCategory(String category, Pageable pageable); // 카테고리별 10개
}
