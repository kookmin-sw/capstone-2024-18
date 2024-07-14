package capstone.facefriend.auth.support;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import org.springframework.util.StringUtils;

public class AuthenticationExtractor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER = "Bearer";

    public static Optional<String> extractAccessToken(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION_HEADER);
        if (!StringUtils.hasText(header)) {
            return Optional.empty();
        }
        return splitAuthorizationHeader(header.split(" "));
    }

    private static Optional<String> splitAuthorizationHeader(String[] parts) {
        if (parts.length == 2 && parts[0].equals(BEARER)) {
            return Optional.ofNullable(parts[1]);
        }
        return Optional.empty();
    }
}
