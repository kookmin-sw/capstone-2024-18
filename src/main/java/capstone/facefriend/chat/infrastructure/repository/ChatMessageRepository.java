package capstone.facefriend.chat.infrastructure.repository;

import capstone.facefriend.chat.domain.ChatMessage;
import org.springframework.data.repository.Repository;


public interface ChatMessageRepository extends Repository<ChatMessage, Long> {
    ChatMessage save(ChatMessage chatMessage);

}
