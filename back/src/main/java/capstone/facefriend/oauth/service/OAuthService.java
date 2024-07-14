package capstone.facefriend.oauth.service;

import capstone.facefriend.auth.dto.TokenResponse;
import capstone.facefriend.auth.infrastructure.JwtProvider;
import capstone.facefriend.member.domain.member.Member;
import capstone.facefriend.member.repository.MemberRepository;
import capstone.facefriend.oauth.domain.OAuthMember;
import capstone.facefriend.oauth.domain.Provider;
import capstone.facefriend.oauth.requestor.OAuthRequester;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final JwtProvider jwtProvider;
    private final OAuthRequester oAuthRequestor;
    private final MemberRepository memberRepository;

    public String loginUri(String redirectUri, String providerName) {
        return oAuthRequestor.loginUri(Provider.from(providerName), redirectUri);
    }

    @Transactional
    public TokenResponse generateTokens(OAuthMember oAuthMember) {
        Member newMember = Member.builder()
                .email(oAuthMember.email())
                .build();

        Member member = memberRepository.findByEmail(oAuthMember.email())
                .orElseGet(() -> memberRepository.save(newMember));

        Long memberId = member.getId();
        String accessToken = jwtProvider.createAccessToken(memberId);
        String refreshToken = jwtProvider.createRefreshToken(memberId);

        return new TokenResponse(accessToken, refreshToken);
    }
}
