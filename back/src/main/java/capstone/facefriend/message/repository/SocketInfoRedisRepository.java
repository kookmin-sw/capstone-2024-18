package capstone.facefriend.message.repository;

import capstone.facefriend.message.domain.SocketInfo;
import org.springframework.data.repository.CrudRepository;

public interface SocketInfoRedisRepository extends CrudRepository<SocketInfo, Long> {

}