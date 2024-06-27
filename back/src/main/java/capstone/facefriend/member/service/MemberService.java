package capstone.facefriend.member.service;

import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.domain.token.TokenProvider;
import capstone.facefriend.email.controller.dto.EmailVerificationResponse;
import capstone.facefriend.email.service.EmailService;
import capstone.facefriend.member.domain.analysisInfo.AnalysisInfo;
import capstone.facefriend.member.repository.AnalysisInfoRepository;
import capstone.facefriend.member.domain.basicInfo.BasicInfo;
import capstone.facefriend.member.repository.BasicInfoRepository;
import capstone.facefriend.member.domain.faceInfo.FaceInfo;
import capstone.facefriend.member.repository.FaceInfoByLevelRepository;
import capstone.facefriend.member.repository.FaceInfoRepository;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.member.exception.member.MemberException;
import capstone.facefriend.member.dto.member.FindEmailResponse;
import capstone.facefriend.member.dto.member.SignInRequest;
import capstone.facefriend.member.dto.member.SignUpRequest;
import capstone.facefriend.member.dto.member.SignupResponse;
import capstone.facefriend.redis.RedisDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static capstone.facefriend.member.domain.basicInfo.BasicInfo.*;
import static capstone.facefriend.member.domain.member.Role.USER;
import static capstone.facefriend.member.exception.member.MemberExceptionType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;
    private final BasicInfoRepository basicInfoRepository;
    private final FaceInfoRepository faceInfoRepository;
    private final FaceInfoByLevelRepository faceInfoByLevelRepository;
    private final AnalysisInfoRepository analysisInfoRepository;

    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final RedisDao redisDao;

    private static final String SIGN_UP_VALID_EMAIL = "사용 가능한 이메일입니다.";
    private static final String SIGN_OUT_SUCCESS_MESSAGE = "로그아웃 성공";
    private static final String RESET_PASSWORD_SUCCESS_MESSAGE = "비밀번호 재설정 성공";
    private static final String EXIT_SUCCESS_MESSAGE = "회원탈퇴 성공";

    private static final String EYE = "눈";
    private static final String FACE_SHAPE = "얼굴형";
    private static final String LIPS = "입술";
    private static final String NOSE = "코";
    private static final String EYEBROW = "눈썹";
    private static final String DESCRIPTION = "관상 분석 설명이 없습니다!";
    private static final String TAG = "관상 분석 태그가 없습니다!";
    private static final Integer FACE_SHAPE_ID_NUM = -1;

    private static final Long BLACKLIST_REMAIN_MINUTE = 1000 * 60 * 60 * 12L;

    @Value("${spring.cloud.aws.s3.default-profile}")
    private String defaultFaceInfoS3url;

    @Transactional
    public String verifyDuplication(String email) {
        if (memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(DUPLICATED_EMAIL);
        }
        return SIGN_UP_VALID_EMAIL;
    }

    @Transactional
    public String sendCode(String email) {
        if (memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(DUPLICATED_EMAIL);
        }
        return emailService.sendCode(email);
    }

    @Transactional
    public EmailVerificationResponse verifyCode(String email, String code) {
        boolean isVerified = emailService.verifyCode(email, code);

        if (isVerified) {
            return new EmailVerificationResponse(email, true);
        }
        return new EmailVerificationResponse(email, false);
    }

    @Transactional
    public SignupResponse signUp(SignUpRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());

        BasicInfo basicInfo = initBasicInfo();
        FaceInfo faceInfo = initFaceInfo();
        AnalysisInfo analysisInfo = initAnalysisInfo();

        Member member = initMember(request, encodedPassword, basicInfo, faceInfo, analysisInfo);

        return new SignupResponse(member.getId());
    }

    private BasicInfo initBasicInfo() {
        BasicInfo basicInfo = BasicInfo.builder()
                .nickname("")
                .gender(Gender.DEFAULT)
                .ageGroup(AgeGroup.DEFAULT)
                .ageDegree(AgeDegree.DEFAULT)
                .heightGroup(HeightGroup.DEFAULT)
                .region(Region.DEFAULT)
                .build();
        basicInfoRepository.save(basicInfo);
        return basicInfo;
    }

    private FaceInfo initFaceInfo() {
        FaceInfo faceInfo = FaceInfo.builder()
                .originS3url(defaultFaceInfoS3url)
                .generatedS3url(defaultFaceInfoS3url)
                .build();
        faceInfoRepository.save(faceInfo);
        return faceInfo;
    }

    private AnalysisInfo initAnalysisInfo() {
        AnalysisInfo analysisInfo = AnalysisInfo.builder()
                .analysisFull(Map.of(EYE, DESCRIPTION,
                                FACE_SHAPE, DESCRIPTION,
                                LIPS, DESCRIPTION,
                                NOSE, DESCRIPTION,
                                EYEBROW, DESCRIPTION))
                .analysisShort(List.of(TAG))
                .faceShapeIdNum(FACE_SHAPE_ID_NUM)
                .build();
        analysisInfoRepository.save(analysisInfo);
        return analysisInfo;
    }

    private Member initMember(
            SignUpRequest request,
            String encodedPassword,
            BasicInfo basicInfo,
            FaceInfo faceInfo,
            AnalysisInfo analysisInfo
    ) {
        Member member = Member.builder()
                .email(request.email())
                .password(encodedPassword)
                .role(USER)
                .basicInfo(basicInfo) // 기본정보
                .faceInfo(faceInfo) // 관상 이미지
                .analysisInfo(analysisInfo) // 관상 분석
                .build();
        memberRepository.save(member);
        return member;
    }





    @Transactional
    public TokenResponse signIn(SignInRequest request) {
        String email = request.email();
        String password = request.password();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new MemberException(WRONG_PASSWORD);
        }
        return tokenProvider.createTokens(member.getId());
    }

    @Transactional
    public String signOut(Long memberId, String accessToken) {
        redisDao.deleteRefreshToken(String.valueOf(memberId));
        redisDao.setAccessTokenSignOut(accessToken, BLACKLIST_REMAIN_MINUTE);
        return SIGN_OUT_SUCCESS_MESSAGE;
    }

    @Transactional
    public String exit(Long memberId) {
        if (memberRepository.findById(memberId).isPresent()) {
            memberRepository.deleteById(memberId);
        }
        return EXIT_SUCCESS_MESSAGE;
    }

    @Transactional
    public TokenResponse reissueTokens(Long memberId, String refreshTokenInput) {
        String refreshToken = redisDao.getRefreshToken(String.valueOf(memberId));
        if (!refreshToken.equals(refreshTokenInput)) {
            throw new MemberException(INVALID_REFRESH_TOKEN);
        }
        return tokenProvider.createTokens(memberId);
    }

    @Transactional
    public FindEmailResponse findEmail(String emailInput) {

        Member member = memberRepository.findByEmail(emailInput)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        String email = member.getEmail();

        if (email.equals(emailInput)) {
            return new FindEmailResponse(email, true);
        }
        return new FindEmailResponse(email, false);
    }

    @Transactional
    public String sendTemporaryPassword(String email) {
        if (!memberRepository.findByEmail(email).isPresent()) {
            throw new MemberException(NOT_FOUND);
        }
        return emailService.sendTemporaryPassword(email);
    }

    @Transactional
    public String verifyTemporaryPassword(String email, String temporaryPassword, String newPassword) {
        boolean isVerified = emailService.verifyTemporaryPassword(email, temporaryPassword);

        if (isVerified) {
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new MemberException(NOT_FOUND));

            String encodedPassword = passwordEncoder.encode(newPassword);
            member.setPassword(encodedPassword);
            memberRepository.save(member);
        } else {
            throw new MemberException(WRONG_TEMPORARY_PASSWORD);
        }
        return RESET_PASSWORD_SUCCESS_MESSAGE;
    }

    @Transactional
    public String resetPassword(Long memberId, String newPassword) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(NOT_FOUND));

        String encodedPassword = passwordEncoder.encode(newPassword);

        member.setPassword(encodedPassword);
        memberRepository.save(member);

        return RESET_PASSWORD_SUCCESS_MESSAGE;
    }
}
