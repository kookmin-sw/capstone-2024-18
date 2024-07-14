package capstone.facefriend.auth.config;

import static capstone.facefriend.auth.interceptor.HttpMethod.ANY;
import static capstone.facefriend.auth.interceptor.HttpMethod.GET;
import static capstone.facefriend.auth.interceptor.HttpMethod.OPTIONS;
import static capstone.facefriend.auth.interceptor.HttpMethod.POST;

import capstone.facefriend.auth.interceptor.LoginCheckInterceptor;
import capstone.facefriend.auth.interceptor.LoginInterceptor;
import capstone.facefriend.auth.interceptor.PathMatchInterceptor;
import capstone.facefriend.auth.interceptor.TokenBlackListInterceptor;
import capstone.facefriend.auth.interceptor.TokenReissueInterceptor;
import capstone.facefriend.auth.support.AuthArgumentResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class AuthConfig implements WebMvcConfigurer {

    private final AuthArgumentResolver authArgumentResolver;

    private final LoginCheckInterceptor loginCheckInterceptor;
    private final LoginInterceptor loginInterceptor;
    private final TokenReissueInterceptor tokenReissueInterceptor;
    private final TokenBlackListInterceptor tokenBlackListInterceptor;

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
    }

    private HandlerInterceptor loginCheckInterceptor() {
        return new PathMatchInterceptor(loginCheckInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/member/**", ANY)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/analysis-info/**", ANY)
                .addIncludePathPattern("/resume/**", ANY)
                .addIncludePathPattern("/room/list", GET)
                .addIncludePathPattern("/stomp/disconnect", POST)
                .addIncludePathPattern("/chat/**", GET)
                .addIncludePathPattern("/room/**", POST)

                .addExcludePathPattern("/member/reissue/**", POST); // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.
    }

    private HandlerInterceptor loginInterceptor() {
        return new PathMatchInterceptor(loginInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/member/**", ANY)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/analysis-info/**", ANY)
                .addIncludePathPattern("/resume/**", ANY)
                .addIncludePathPattern("/room/list", GET)
                .addIncludePathPattern("/stomp/disconnect", POST)
                .addIncludePathPattern("/chat/**", GET)
                .addIncludePathPattern("/room/**", POST)

                .addExcludePathPattern("/member/reissue", POST); // 토큰 만료 시에는 해당 요청을 가로채지 않아야 합니다.
    }

    private HandlerInterceptor tokenReissueInterceptor() {
        return new PathMatchInterceptor(tokenReissueInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/member/reissue", POST); // 토큰 재발급 시에는 해당 요청을 가로채야 합니다.
    }

    private HandlerInterceptor tokenBlackListInterceptor() {
        return new PathMatchInterceptor(tokenBlackListInterceptor)
                .addExcludePathPattern("/**", OPTIONS)

                .addIncludePathPattern("/member/**", ANY)
                .addIncludePathPattern("/basic-info", ANY)
                .addIncludePathPattern("/face-info", ANY)
                .addIncludePathPattern("/analysis-info/**", ANY)
                .addIncludePathPattern("/resume/**", ANY)
                .addIncludePathPattern("/room/list", GET)
                .addIncludePathPattern("/stomp/disconnect", POST)
                .addIncludePathPattern("/chat/**", GET)
                .addIncludePathPattern("/room/**", POST)
                ;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
