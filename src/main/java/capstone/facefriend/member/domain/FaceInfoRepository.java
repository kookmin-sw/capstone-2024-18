package capstone.facefriend.member.domain;

import org.springframework.data.repository.Repository;

public interface FaceInfoRepository extends Repository<FaceInfo, Long> {

    FaceInfo save(FaceInfo faceInfo);

}
