package capstone.facefriend.chat.service.dto.heart;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class SendHeartRequest {
    private Long receiveId;
}