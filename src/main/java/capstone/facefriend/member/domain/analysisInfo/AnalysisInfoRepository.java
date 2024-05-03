package capstone.facefriend.member.domain.analysisInfo;

import org.springframework.data.repository.Repository;

public interface AnalysisInfoRepository extends Repository<AnalysisInfo, Long> {

    AnalysisInfo save(AnalysisInfo analysisInfo);
}
