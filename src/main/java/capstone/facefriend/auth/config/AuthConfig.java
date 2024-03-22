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

                .addIncludePathPattern("/oauth/google/login", POST)
                .addIncludePathPattern("/members/signin", POST)

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

                .addIncludePathPattern("/signout", DELETE)

                .addIncludePathPattern("/test", GET);
    }

    private HandlerInterceptor tokenReissueInterceptor() {
        return new PathMatchInterceptor(tokenReissueInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/reissue", POST); // 토큰 만료 시에는 해당 요청을 가로채야 합니다.
    }

    private HandlerInterceptor tokenBlackListInterceptor() {
        return new PathMatchInterceptor(tokenBlackListInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/test", GET);
    }

    private HandlerInterceptor verificationInterceptor() {
        return new PathMatchInterceptor(verificationInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/test", GET);

//                .addExcludePathPattern("/mail/*", POST) // 인증 코드 발송 요청 시에는 해당 요청을 가로채지 않아야 합니다.
//                .addExcludePathPattern("/mail/*", GET); // 인증 코드 발송 요청 시에는 해당 요청을 가로채지 않아야 합니다.

    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
