package capstone.facefriend.auth.service;


import capstone.facefriend.auth.controller.dto.TokenResponse;
import capstone.facefriend.auth.domain.OAuthMember;
import capstone.facefriend.auth.domain.Provider;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static capstone.facefriend.member.domain.member.Role.*;


@RequiredArgsConstructor
@Service
public class AuthService {

    private final TokenProvider tokenProvider;
    private final OAuthRequester oAuthRequester;
    private final MemberRepository memberRepository;

    private static final String TEMPORARY_GOOGLE_PASSWORD = "google";

    public String loginUri(String redirectUri, String provider) {
        return oAuthRequester.loginUri(Provider.from(provider), redirectUri);
    }

    @Transactional
    public TokenResponse generateTokens(OAuthMember oAuthMember) {
        Member newMember = Member.builder()
                .email(oAuthMember.email())
                .password(TEMPORARY_GOOGLE_PASSWORD)
                .role(USER)
                .build();
        Member member = memberRepository.findByEmail(oAuthMember.email())
                .orElseGet(() -> memberRepository.save(newMember));

        Long memberId = member.getId();
        return new TokenResponse(getAccessToken(memberId), getRefreshToken(memberId), memberId);
    }

    private String getAccessToken(Long memberId) {
        String accessToken = tokenProvider.createAccessToken(memberId);
        return accessToken;
    }

    private String getRefreshToken(Long memberId) {
        String refreshToken = tokenProvider.createRefreshToken(memberId);
        return refreshToken;
    }
}
