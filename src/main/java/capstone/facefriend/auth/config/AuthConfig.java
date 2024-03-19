package capstone.facefriend.auth.config;

import capstone.facefriend.auth.controller.AuthArgumentResolver;
import capstone.facefriend.auth.controller.interceptor.LoginCheckInterceptor;
import capstone.facefriend.auth.controller.interceptor.LoginInterceptor;
import capstone.facefriend.auth.controller.interceptor.PathMatchInterceptor;
import capstone.facefriend.auth.controller.interceptor.TokenInterceptor;
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
    private final TokenInterceptor tokenInterceptor;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginCheckInterceptor());
        registry.addInterceptor(loginInterceptor());
        registry.addInterceptor(tokenInterceptor());
    }

    private HandlerInterceptor loginCheckInterceptor() {
        return new PathMatchInterceptor(loginCheckInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addIncludePathPattern("/oauth/google/test", ANY)
                .addIncludePathPattern("/members/test", ANY)
                .addIncludePathPattern("/members/signout", DELETE);
    }

    private HandlerInterceptor loginInterceptor() {
        return new PathMatchInterceptor(loginInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addIncludePathPattern("/oauth/google/test", ANY)
                .addIncludePathPattern("/members/test", ANY)
                .addIncludePathPattern("/members/signout", DELETE);
    }

    private HandlerInterceptor tokenInterceptor() {
        return new PathMatchInterceptor(tokenInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addIncludePathPattern("/oauth/google/test", ANY)
                .addIncludePathPattern("/members/test", ANY)
                .addIncludePathPattern("/members/signout", DELETE);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
