package capstone.facefriend.chat.domain;

import capstone.facefriend.chat.domain.dto.ChatDto;
import capstone.facefriend.chat.domain.dto.QResponseChat;
import capstone.facefriend.chat.domain.dto.ResponseChat;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static capstone.facefriend.chat.domain.QChat.chat;
import static capstone.facefriend.chat.domain.QChatRoom.*;

public class ChatRepositoryImpl implements ChatRepositoryCustom {

    private JPAQueryFactory queryFactory;

    public ChatRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<ResponseChat> getChats(Long chatRoomId, Pageable pageable) {
        List<ResponseChat> content = queryFactory
                .select(new QResponseChat(
                        chat.id,
                        chatRoom.id.as("chatRoomId"), // ResponseChatRoom DTO 필드에 맞춰야 함
                        chat.senderId,
                        chat.message,
                        chat.sendTime
                ))
                .from(chat)
                .where(chatRoom.id.eq(chatRoomId))
                .leftJoin(chat.chatRoom, chatRoom)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Chat> countQuery = queryFactory
                .selectFrom(chat)
                .leftJoin(chat.chatRoom, chatRoom);

        return PageableExecutionUtils.getPage(content, pageable, () -> countQuery.fetch().size());
    }
}
