package capstone.facefriend.chat.domain.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * capstone.facefriend.chat.domain.dto.QResponseChat is a Querydsl Projection type for ResponseChat
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QResponseChat extends ConstructorExpression<ResponseChat> {

    private static final long serialVersionUID = 821137684L;

    public QResponseChat(com.querydsl.core.types.Expression<Long> id, com.querydsl.core.types.Expression<Long> chatRoomId, com.querydsl.core.types.Expression<Long> senderId, com.querydsl.core.types.Expression<String> message, com.querydsl.core.types.Expression<java.time.LocalDateTime> sendTime) {
        super(ResponseChat.class, new Class<?>[]{long.class, long.class, long.class, String.class, java.time.LocalDateTime.class}, id, chatRoomId, senderId, message, sendTime);
    }

}

