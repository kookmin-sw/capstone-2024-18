package capstone.facefriend.member.repository;

import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import org.springframework.data.repository.Repository;

public interface BasicInfoRepository extends Repository<BasicInfo, Long> {

    BasicInfo save(BasicInfo basicInfo);
}
