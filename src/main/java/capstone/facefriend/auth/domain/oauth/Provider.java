package capstone.facefriend.auth.domain.oauth;

import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.exception.AuthExceptionType;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

public enum Provider {

    GOOGLE("google", GoogleMember::new),
    ;

    private final String providerName;
    private final Function<Map<String, Object>, OAuthMember> function;

    Provider(String providerName, Function<Map<String, Object>, OAuthMember> function) {
        this.providerName = providerName;
        this.function = function;
    }

    public static Provider from(String name) {
        return Arrays.stream(values())
                .filter(it -> it.providerName.equals(name))
                .findFirst()
                .orElseThrow(() -> new AuthException(AuthExceptionType.INVALID_AUTH_PROVIDER));
    }

    public OAuthMember getOAuthMember(Map<String, Object> body) {
        return function.apply(body);
        // function 은 GoogleMember 의 생성자를 의미
        // GoogleMember 생성자의 파라미터에 request body (=Map<String, Object>) 넣어서 OAuthMember 객체 반환
    }
}
