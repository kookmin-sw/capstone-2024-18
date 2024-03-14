package capstone.facefriend.auth.controller.interceptor;


import capstone.facefriend.auth.controller.support.AuthenticationContext;
import capstone.facefriend.auth.controller.support.AuthenticationExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class LoginCheckInterceptor implements HandlerInterceptor {

    private final LoginInterceptor loginInterceptor;
    private final AuthenticationContext authenticationContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (AuthenticationExtractor.extractAuth(request).isEmpty()) {
            authenticationContext.setAnonymous();
            return true;
        }
        return loginInterceptor.preHandle(request, response, handler);
    }
}
