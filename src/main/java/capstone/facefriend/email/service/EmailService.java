package capstone.facefriend.email.service;

import capstone.facefriend.email.exception.EmailException;
import capstone.facefriend.email.exception.EmailExceptionType;
import capstone.facefriend.redis.RedisDao;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Random;

import static capstone.facefriend.email.exception.EmailExceptionType.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;
    private static final String MAIL_TITLE = "[ FACE FRIEND ] 본인 인증을 위한 코드가 도착했어요! \uD83D\uDE0E";
    private static final String MAIL_SUCCESS = "이메일로 코드를 전송했습니다.";

    private final RedisDao redisDao;
    private final JavaMailSender emailSender;

    public String sendCode(String email) {
        String code = createCode(); // 코드 생성
        sendEmail(email, MAIL_TITLE, code); // 메일로 코드 보내기
        redisDao.setCode(email, code, authCodeExpirationMillis); // 코드 레디스 저장
        return MAIL_SUCCESS;
    }

    private String createCode() {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++) {
                sb.append(random.nextInt(10));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new EmailException(NO_SUCH_ALGORITHM);
        }
    }

    private void sendEmail(String email, String title, String text) {
        SimpleMailMessage emailForm = createEmailForm(email, title, text);
        try {
            emailSender.send(emailForm);
        } catch (RuntimeException e) {
            throw new EmailException(UNABLE_TO_SEND_EMAIL);
        }
    }

    private SimpleMailMessage createEmailForm(String email, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(title);
        message.setText(text);
        return message;
    }

    public boolean verifyCode(String email, String codeInput) {
        try {
            String code = redisDao.getCode(email);
            return code.equals(codeInput);
        } catch (NullPointerException e) {
            throw new EmailException(WRONG_EMAIL);
        }
    }
}
