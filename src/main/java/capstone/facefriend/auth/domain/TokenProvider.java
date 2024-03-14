package capstone.facefriend.auth.domain;

public interface TokenProvider {

    String create(Long id);

    Long extractId(String token);
}
