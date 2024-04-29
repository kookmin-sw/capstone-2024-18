package capstone.facefriend.auth.config;

import capstone.facefriend.auth.controller.AuthArgumentResolver;
import capstone.facefriend.auth.controller.interceptor.*;
import capstone.facefriend.email.controller.interceptor.VerificationInterceptor;
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

    private HandlerInterceptor loginCheckInterceptor() {
        return new PathMatchInterceptor(loginCheckInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/auth/reset-password", POST)
                .addIncludePathPattern("/auth/signout", DELETE)
                .addIncludePathPattern("/auth/exit", DELETE)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/room", ANY)
                .addIncludePathPattern("/room/**", ANY)

                .addExcludePathPattern("/auth/reissue", POST); // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.
    }

    private HandlerInterceptor loginInterceptor() {
        return new PathMatchInterceptor(loginInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/auth/reset-password", POST)
                .addIncludePathPattern("/auth/signout", DELETE)
                .addIncludePathPattern("/auth/exit", DELETE)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/room", ANY)
                .addIncludePathPattern("/room/**", ANY)

                .addExcludePathPattern("/auth/reissue", POST); // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.
    }

    private HandlerInterceptor tokenReissueInterceptor() {
        return new PathMatchInterceptor(tokenReissueInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/auth/reissue", POST); // 토큰 재발급 시에는 해당 요청을 가로채야 합니다.
    }

    private HandlerInterceptor tokenBlackListInterceptor() {
        return new PathMatchInterceptor(tokenBlackListInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/auth/signout", DELETE)
                .addIncludePathPattern("/auth/exit", DELETE)
                .addIncludePathPattern("/auth/reset-password", POST)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/room", ANY)
                .addIncludePathPattern("/room/**", ANY);
    }

    private HandlerInterceptor verificationInterceptor() {
        return new PathMatchInterceptor(verificationInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/auth/signout", DELETE)
                .addIncludePathPattern("/auth/exit", DELETE)
                .addIncludePathPattern("/auth/reset-password", POST)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
