package capstone.facefriend.auth.config;

import capstone.facefriend.auth.controller.AuthArgumentResolver;
import capstone.facefriend.auth.controller.interceptor.LoginCheckInterceptor;
import capstone.facefriend.auth.controller.interceptor.LoginInterceptor;
import capstone.facefriend.auth.controller.interceptor.PathMatchInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static capstone.facefriend.auth.controller.interceptor.HttpMethod.ANY;
import static capstone.facefriend.auth.controller.interceptor.HttpMethod.OPTIONS;

@RequiredArgsConstructor
@Configuration
public class AuthConfig implements WebMvcConfigurer {

    private final AuthArgumentResolver authArgumentResolver;
    private final LoginInterceptor loginInterceptor;
    private final LoginCheckInterceptor loginCheckInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginCheckInterceptor());
        registry.addInterceptor(loginInterceptor());
    }

    private HandlerInterceptor loginCheckInterceptor() {
        return new PathMatchInterceptor(loginCheckInterceptor)
                .addExcludePathPattern("/**", OPTIONS);
    }

    private HandlerInterceptor loginInterceptor() {
        return new PathMatchInterceptor(loginInterceptor)
                .addExcludePathPattern("/**", OPTIONS)
                .addIncludePathPattern("/admin/**", ANY)
                .addIncludePathPattern("/members/**", ANY);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
