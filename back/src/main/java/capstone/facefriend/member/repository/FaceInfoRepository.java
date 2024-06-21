package capstone.facefriend.member.repository;

import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import org.springframework.data.repository.Repository;

public interface FaceInfoRepository extends Repository<FaceInfo, Long> {

    FaceInfo save(FaceInfo faceInfo);

    FaceInfo findFaceInfoById(Long id);

    void deleteFaceInfoById(Long id);
}
