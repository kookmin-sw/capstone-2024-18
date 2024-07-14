package capstone.facefriend.message.repository;

import capstone.facefriend.message.domain.Message;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface MessageRepository extends CrudRepository<Message, Long> {

    Message findFirstByChatRoomIdOrderBySendTimeDesc(Long roomId);

    Message save(Message message);

    List<Message> findChatMessagesByChatRoom_IdAndSendTimeBefore(Long roomId, LocalDateTime time, Pageable pageable);

    List<Message> findChatMessagesByChatRoomId(Long roomId);
}