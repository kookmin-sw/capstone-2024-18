package capstone.facefriend.auth.service;


import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.domain.oauth.OAuthMember;
import capstone.facefriend.auth.domain.oauth.Provider;
import capstone.facefriend.auth.domain.token.AccessToken;
import capstone.facefriend.auth.domain.token.RefreshToken;
import capstone.facefriend.auth.domain.token.TokenProvider;
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

        AccessToken accessToken = AccessToken.from(createAccessToken(memberId));
        RefreshToken refreshToken = RefreshToken.from(createRefreshToken(memberId));

        return new TokenResponse(accessToken, refreshToken, memberId);
    }

    private String createAccessToken(Long memberId) {
        String accessToken = tokenProvider.createAccessToken(memberId);
        return accessToken;
    }

    private String createRefreshToken(Long memberId) {
        String refreshToken = tokenProvider.createRefreshToken(memberId);
        return refreshToken;
    }
}
