package capstone.facefriend.member.repository;

import capstone.facefriend.member.domain.faceInfo.FaceInfoByLevel;
import org.springframework.data.repository.Repository;

public interface FaceInfoByLevelRepository extends Repository<FaceInfoByLevel, Long> {
    FaceInfoByLevel save(FaceInfoByLevel faceInfoByLevel);
}
