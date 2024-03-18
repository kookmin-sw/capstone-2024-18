package capstone.facefriend.auth.controller.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class PathMatchInterceptor implements HandlerInterceptor {

    private final HandlerInterceptor handlerInterceptor;
    private final PathContainer pathContainer;

    public PathMatchInterceptor(HandlerInterceptor handlerInterceptor) {
        this.handlerInterceptor = handlerInterceptor;
        this.pathContainer = new PathContainer();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (pathContainer.isNotIncludePathPattern(request.getServletPath(), request.getMethod())) {
            return true;
        }
        return handlerInterceptor.preHandle(request, response, handler);
    }

    public PathMatchInterceptor addIncludePathPattern(String pathPattern, HttpMethod... httpMethod) {
        pathContainer.addIncludePattern(pathPattern, httpMethod);
        return this;
    }

    public PathMatchInterceptor addExcludePathPattern(String pathPattern, HttpMethod... httpMethod) {
        pathContainer.addExcludePattern(pathPattern, httpMethod);
        return this;
    }
}
