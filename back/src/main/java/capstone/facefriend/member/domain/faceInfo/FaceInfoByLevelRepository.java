package capstone.facefriend.member.domain.faceInfo;

import org.springframework.data.repository.Repository;

public interface FaceInfoByLevelRepository extends Repository<FaceInfoByLevel, Long> {

    FaceInfoByLevel save(FaceInfoByLevel faceInfoByLevel);
}
