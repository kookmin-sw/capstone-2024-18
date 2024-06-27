package capstone.facefriend.member.repository;

import capstone.facefriend.common.aop.TimeTrace;
import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import org.springframework.data.repository.Repository;

public interface AnalysisInfoRepository extends Repository<AnalysisInfo, Long> {

    @TimeTrace
    AnalysisInfo save(AnalysisInfo analysisInfo);

    AnalysisInfo findAnalysisInfoById(Long id);
}
