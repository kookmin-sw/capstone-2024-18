package capstone.facefriend.message.repository;

import capstone.facefriend.message.domain.Room;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RoomRepository extends CrudRepository<Room, Long> {

    Optional<Room> findById(Long id);

    Room save(Room room);
}