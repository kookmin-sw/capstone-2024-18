package capstone.facefriend.auth.config;

import capstone.facefriend.auth.controller.AuthArgumentResolver;
import capstone.facefriend.auth.controller.interceptor.*;
import capstone.facefriend.auth.mail.controller.interceptor.VerificationInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static capstone.facefriend.auth.controller.interceptor.HttpMethod.*;

@RequiredArgsConstructor
@Configuration
@Slf4j
public class AuthConfig implements WebMvcConfigurer {

    private final AuthArgumentResolver authArgumentResolver;

    private final LoginCheckInterceptor loginCheckInterceptor;
    private final LoginInterceptor loginInterceptor;
    private final TokenReissueInterceptor tokenReissueInterceptor;
    private final TokenBlackListInterceptor tokenBlackListInterceptor;
    private final VerificationInterceptor verificationInterceptor;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginCheckInterceptor());
        registry.addInterceptor(loginInterceptor());
        registry.addInterceptor(tokenReissueInterceptor());
        registry.addInterceptor(tokenBlackListInterceptor());
        registry.addInterceptor(verificationInterceptor());
    }

    // 회원가입하지 않은 사용자 id 를 -1 로 저장하기 위한 인터셉터입니다.
    // * 해당 인터셉터는 로그인 시점을 포함한 그 이후의 메서드들을 호출할 때 사용됩니다.
    private HandlerInterceptor loginCheckInterceptor() {
        return new PathMatchInterceptor(loginCheckInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addExcludePathPattern("/reissue", POST) // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.

                // 구글 유저
                .addIncludePathPattern("/oauth/google/login", POST)
                // 일반 유저
                .addIncludePathPattern("/members/signin", POST)
                // 구글 유저, 일반 유저 공통 로직
                .addIncludePathPattern("/signout", DELETE)
                .addIncludePathPattern("/test", GET);
    }

    // 회원가입한 사용자의 id 를 추출하기 위한 인터셉터입니다.
    // (1) 토큰이 만료된 경우 (2) 토큰이 위조된 경우
    // (3) 토큰이 블랙리스트에 등록된 경우 (4) 로그인하는 경우
    // 예외를 터트려 재로그인 또는 토큰 재발급을 강제하기 위한 인터셉터입니다.
    // * 해당 인터셉터는 로그인 시점을 포함한 그 이후의 메서드들을 호출할 때 사용됩니다.
    private HandlerInterceptor loginInterceptor() {
        return new PathMatchInterceptor(loginInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addExcludePathPattern("/reissue", POST) // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.

                // 구글 유저, 일반 유저 공통 로직
                .addIncludePathPattern("/signout", DELETE)
                .addIncludePathPattern("/test", GET);
    }

    // 회원가입한 사용자의 id 를 추출하기 위한 인터셉터입니다.
    // (1) 토큰이 만료된 경우 (2) 토큰이 위조된 경우
    // (3) 토큰이 블랙리스트에 등록된 경우 (4) 로그인하는 경우
    // 예외를 터트리지 않고 실제로 토큰 재발급을 해주기 위해 사용됩니다.
    // * 해당 인터셉터는 토큰 재발급 시에만 사용되어야만 합니다.
    // * 요청을 보낼 때 실려있는 토큰은 유효하지 않은 토큰(위 3가지 경우)인 것이 정상입니다.
    private HandlerInterceptor tokenReissueInterceptor() {
        return new PathMatchInterceptor(tokenReissueInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                // 구글 유저, 일반 유저 공통 로직
                .addIncludePathPattern("/reissue", POST); // 토큰 만료 시에는 해당 요청을 가로채야 합니다.
    }

    // 재로그인 또는 토큰 재발급 이후, 토큰을 Authorization header 에 제대로 갈아끼웠는지를 확인하기 위한 인터셉터입니다.
    // * 해당 인터셉터는 로그인 이후의 메서드들을 호출할 때 사용됩니다.
    // * 최초 로그인 시에는 토큰이 없는게 정상입니다. 로그인 이후에 토큰을 발급받기 때문입니다.
    private HandlerInterceptor tokenBlackListInterceptor() {
        return new PathMatchInterceptor(tokenBlackListInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                // 구글 유저, 일반 유저 공통 로직
                .addIncludePathPattern("/test", GET)
                ;
    }

    // 서비스를 이용하기 위해서 본인인증 여부를 판단하고 본인인증하지 않았다면 이를 강제하기 위한 인터셉터입니다.
    // * 해당 인터셉터는 로그인 이후의 메서드들 호출할 때 사용됩니다,
    private HandlerInterceptor verificationInterceptor() {
        return new PathMatchInterceptor(verificationInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                // 구글 유저, 일반 유저 공통 로직
                .addExcludePathPattern("/mail/*", POST)
                .addExcludePathPattern("/mail/*", GET)
                .addIncludePathPattern("/test", GET);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
