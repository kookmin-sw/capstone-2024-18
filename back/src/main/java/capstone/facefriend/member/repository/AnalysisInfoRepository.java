package capstone.facefriend.member.repository;

import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import org.springframework.data.repository.Repository;

public interface AnalysisInfoRepository extends Repository<AnalysisInfo, Long> {

    AnalysisInfo save(AnalysisInfo analysisInfo);
}
