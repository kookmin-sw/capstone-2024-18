package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.Room;
import org.springframework.data.repository.Repository;

import java.util.Optional;
public interface RoomRepository extends Repository<Room, Long> {

    Optional<Room> findById(Long id);
    Optional<Room> findByName(String name);
    Room save(Room room);
}
