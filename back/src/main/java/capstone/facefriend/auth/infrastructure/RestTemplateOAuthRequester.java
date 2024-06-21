package capstone.facefriend.auth.infrastructure;

import capstone.facefriend.auth.domain.oauth.OAuthMember;
import capstone.facefriend.auth.domain.oauth.Provider;
import capstone.facefriend.auth.exception.AuthException;
import capstone.facefriend.auth.exception.AuthExceptionType;
import capstone.facefriend.auth.dto.OAuthTokenResponse;
import capstone.facefriend.auth.service.OAuthProviderProperties;
import capstone.facefriend.auth.service.OAuthProviderProperties.OAuthProviderProperty;
import capstone.facefriend.auth.service.OAuthRequester;
import capstone.facefriend.auth.dto.OAuthLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@RequiredArgsConstructor
@Component
public class RestTemplateOAuthRequester implements OAuthRequester {

    private static final String CODE = "code";
    private static final String GRANT_TYPE = "grant_type";
    private static final String AUTHORIZATION_CODE = "authorization_code";
    private static final String REDIRECT_URI = "redirect_uri";
    private static final String CLIENT_ID = "client_id";
    private static final String RESPONSE_TYPE = "response_type";
    private static final String SCOPE = "scope";

    private final RestTemplate restTemplate;
    private final OAuthProviderProperties oAuthProviderProperties;

    @Override
    public String loginUri(Provider provider, String redirectUri) {
        OAuthProviderProperty providerProperties = oAuthProviderProperties.getProviderProperties(provider);
        return UriComponentsBuilder.fromUriString(providerProperties.getLoginUrl())
                .queryParam(CLIENT_ID, providerProperties.getId())
                .queryParam(REDIRECT_URI, redirectUri) // should register redirectUri in google cloud
                .queryParam(RESPONSE_TYPE, CODE)
                .queryParam(SCOPE, providerProperties.getScope())
                .build()
                .toString();
    }

    @Override
    public OAuthMember login(OAuthLoginRequest request, String requestProvider) {
        Provider provider = Provider.from(requestProvider);
        OAuthProviderProperty property = oAuthProviderProperties.getProviderProperties(provider);
        OAuthTokenResponse token = getOAuthToken(property, request);
        return provider.getOAuthMember(getUserAttributes(property, token));
    }

    private OAuthTokenResponse getOAuthToken(OAuthProviderProperty property, OAuthLoginRequest loginRequest) {
        HttpHeaders headers = headerWithProviderSecret(property);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);
        URI tokenUri = getTokenUri(property, loginRequest);
        return requestOAuthToken(tokenUri, request);
    }

    private HttpHeaders headerWithProviderSecret(OAuthProviderProperty property) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(property.getId(), property.getSecret());
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

    private URI getTokenUri(OAuthProviderProperty property, OAuthLoginRequest request) {
        return UriComponentsBuilder.fromUriString(property.getTokenUrl())
                .queryParam(CODE, URLDecoder.decode(request.code(), StandardCharsets.UTF_8))
                .queryParam(GRANT_TYPE, AUTHORIZATION_CODE)
                .queryParam(REDIRECT_URI, request.redirectUri())
                .build()
                .toUri();
    }

    private OAuthTokenResponse requestOAuthToken(URI tokenUri, HttpEntity<MultiValueMap<String, String>> request) {
        try {
            return restTemplate.postForEntity(tokenUri, request, OAuthTokenResponse.class).getBody();
        } catch (Exception e) {
            throw new AuthException(AuthExceptionType.BAD_REQUEST_TO_PROVIDER);
        }
    }

    private Map<String, Object> getUserAttributes(OAuthProviderProperty property, OAuthTokenResponse tokenResponse) {
        HttpHeaders headers = headerWithToken(tokenResponse);
        URI uri = URI.create(property.getInfoUrl());
        RequestEntity<?> requestEntity = new RequestEntity<>(headers, HttpMethod.GET, uri);
        return requestUserAttributes(requestEntity);
    }

    private HttpHeaders headerWithToken(OAuthTokenResponse tokenResponse) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenResponse.accessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private Map<String, Object> requestUserAttributes(RequestEntity<?> requestEntity) {
        try {
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(requestEntity, new ParameterizedTypeReference<>() {
            });
            return responseEntity.getBody();
        } catch (Exception e) {
            throw new AuthException(AuthExceptionType.BAD_REQUEST_TO_PROVIDER);
        }
    }
}
