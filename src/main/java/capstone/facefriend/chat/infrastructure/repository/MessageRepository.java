package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomIdOrderByCreatedAt(Long roomId, Pageable pageable);

    Message save(Message message);

}
