package capstone.facefriend.chat.domain;

import capstone.facefriend.chat.domain.dto.ResponseChat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChatRepositoryCustom {
    Page<ResponseChat> getChats(Long chatRoomId, Pageable pageable);
}
