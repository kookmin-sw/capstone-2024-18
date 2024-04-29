package capstone.facefriend.email.service;

import capstone.facefriend.email.exception.EmailException;
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
    private static final String EMAIL_TITLE_OF_VERIFICATION = "[ FACE FRIEND ] 본인 인증을 위한 코드가 도착했어요! \uD83D\uDE0E";
    private static final String EMAIL_TITLE_OF_RESET_PASSWORD = "[ FACE FRIEND ] 임시 비밀번호가 도착했어요! \uD83E\uDD13";
    private static final String EMAIL_SUCCESS_OF_VERIFICATION = "이메일로 인증코드를 전송했습니다.";
    private static final String EMAIL_SUCCESS_OF_RESET_PASSWORD = "이메일로 임시 비밀번호를 전송했습니다.";


    private final RedisDao redisDao;
    private final JavaMailSender emailSender;

    public String sendCode(String email) {
        String code = createCode();
        sendEmail(email, EMAIL_TITLE_OF_VERIFICATION, code);
        redisDao.setCode(email, code, authCodeExpirationMillis);
        return EMAIL_SUCCESS_OF_VERIFICATION;
    }

    public String sendTemporaryPassword(String email) {
        String code = createCode();
        sendEmail(email, EMAIL_TITLE_OF_RESET_PASSWORD, code);
        redisDao.setCode(email, code, authCodeExpirationMillis);
        return EMAIL_SUCCESS_OF_RESET_PASSWORD;
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

    public boolean verifyTemporaryPassword(String email, String temporaryPassword) {
        try {
            String code = redisDao.getCode(email);
            return code.equals(temporaryPassword);
        } catch (NullPointerException e) {
            throw new EmailException(WRONG_EMAIL);
        }
    }
}
