package capstone.facefriend.member.domain.basicInfo;

import org.springframework.data.repository.Repository;

public interface BasicInfoRepository extends Repository<BasicInfo, Long> {

    BasicInfo save(BasicInfo basicInfo);
}
