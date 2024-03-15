package capstone.facefriend.auth.service;


import capstone.facefriend.auth.domain.OAuthMember;
import capstone.facefriend.auth.domain.Provider;
import capstone.facefriend.auth.domain.TokenProvider;
import capstone.facefriend.member.domain.Member;
import capstone.facefriend.member.domain.MemberRepository;
import capstone.facefriend.member.domain.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@RequiredArgsConstructor
@Service
public class AuthService {

    private final TokenProvider tokenProvider;
    private final OAuthRequester oAuthRequester;
    private final MemberRepository memberRepository;

    public String loginUri(String redirectUri, String provider) {
        return oAuthRequester.loginUri(Provider.from(provider), redirectUri);
    }

    @Transactional
    public String generateToken(OAuthMember oAuthMember) {
        Member newMember = Member.builder()
                .email(oAuthMember.email())
                .name(oAuthMember.nickname())
                .imageUrl(oAuthMember.imageUrl())
                .role(Role.USER)
                .build();
        Member member = memberRepository.findByEmail(oAuthMember.email())
                .orElseGet(() -> memberRepository.save(newMember));
        return tokenProvider.create(member.getId());
    }
}
