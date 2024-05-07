package capstone.facefriend.chat.repository;

import capstone.facefriend.chat.domain.SocketInfo;
import org.springframework.data.repository.CrudRepository;

public interface SocketInfoRedisRepository extends CrudRepository<SocketInfo, Long> {

}
