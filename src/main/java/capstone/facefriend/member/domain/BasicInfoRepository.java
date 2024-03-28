package capstone.facefriend.member.domain;

import org.springframework.data.repository.Repository;

public interface BasicInfoRepository extends Repository<BasicInfo, Long> {

    BasicInfo save(BasicInfo basicInfo);

    BasicInfo findBasicInfosById(Long id);
}
