package capstone.facefriend.email;

import capstone.facefriend.email.support.VerifiedMember;
import capstone.facefriend.email.support.VerificationContext;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@RequiredArgsConstructor
@Component
public class VerificationArgumentResolver implements HandlerMethodArgumentResolver {

    private final VerificationContext verificationContext;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(VerifiedMember.class) &&
                parameter.getParameterType().equals(Boolean.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory) {
        return verificationContext.getIsVerified();
    }
}
