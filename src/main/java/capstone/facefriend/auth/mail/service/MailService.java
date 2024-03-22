package capstone.facefriend.auth.mail.service;

import capstone.facefriend.auth.mail.exception.MailException;
import capstone.facefriend.member.domain.MemberRepository;
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

import static capstone.facefriend.auth.mail.exception.MailExceptionType.NO_SUCH_ALGORITHM;
import static capstone.facefriend.auth.mail.exception.MailExceptionType.UNABLE_TO_SEND_MAIL;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;
    private static final String MAIL_TITLE = "[ FACE FRIEND ] 본인 인증을 위한 코드가 도착했어요! \uD83D\uDE0E";
    private static final String MAIL_SUCCESS = "이메일로 코드를 전송했습니다.";

    private final RedisDao redisDao;
    private final JavaMailSender mailSender;
    private final MemberRepository memberRepository;

    public String sendCode(String mail) {
        String code = createCode(); // 코드 생성
        sendMail(mail, MAIL_TITLE, code); // 메일로 코드 보내기
        redisDao.setCode(mail, code, authCodeExpirationMillis); // 코드 레디스 저장
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
            throw new MailException(NO_SUCH_ALGORITHM);
        }
    }

    private void sendMail(String mail, String title, String text) {
        SimpleMailMessage emailForm = createMailForm(mail, title, text);
        try {
            mailSender.send(emailForm);
        } catch (RuntimeException e) {
            throw new MailException(UNABLE_TO_SEND_MAIL);
        }
    }

    private SimpleMailMessage createMailForm(String mail, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mail);
        message.setSubject(title);
        message.setText(text);
        return message;
    }

    public boolean verifyCode(String mail, String codeInput) {
        String code = redisDao.getCode(mail);
        return code.equals(codeInput);
    }
}
