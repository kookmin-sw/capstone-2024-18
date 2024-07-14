package capstone.facefriend.oauth.domain;

import java.util.Map;

public class KakaoMember implements OAuthMember {

    private final String id;
    private final String name;
    private final String email;
    private final String imageUrl;

    public KakaoMember(Map<String, Object> attribute) {
        this.id = (String) attribute.get("id");
        this.name = (String) attribute.get("nickname");
        this.email = (String) attribute.get("email");
        this.imageUrl = (String) attribute.get("profile_image_url");
    }

    @Override
    public String id() {
        return id;
    }

    @Override
    public String nickname() {
        return name;
    }

    @Override
    public String email() {
        return email;
    }

    @Override
    public String imageUrl() {
        return imageUrl;
    }
}